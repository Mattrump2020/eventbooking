import Booking from '../model/booking.js';
import Event from  "../model/event.js";
import User from "../model/user.js";
import mongoose from 'mongoose';
import sendEmail from '../utils/email.js';

// @desc    Get all bookings
// @route   GET /bookings
// @access  Private (Admin only)
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find() 
            .populate('event', 'title date time location')
            .populate('user', 'name email');
        res.status(200).json(bookings)
    } catch (error){
        next(error)
    }
};

// @desc    Get a single booking
// @route   GET /bookings/:id
// @access  Private (Admin only)
const getBookingById = async (req, res, next) =>{

    try {
        const booking = await Booking.findById(req.params.id)
        .populate('event', 'title date time location')
        .populate('user', 'name email');

        if(!booking){
            return res.status(404).json({
                message: 'Booking not found'
            })
        }
        res.status(201).json(booking)

    } catch (error){
        next(error)
    }
}

// @desc    Get bookings for the logged-in user
// @route   GET /bookings/my-bookings
// @access  Private
const getMyBookings = async(req, res)=>{
    try{
        const userId = req.user.userId
        const bookings = await Booking.find({user: userId})
        .populate('event', 'title date time location')
        .populate('user', 'name email')
        res.status(200).json(bookings);
    } catch (error){
        next(error)
    }
}

// @desc    Get bookings for the logged-in user
// @route   GET /bookings/my-bookings
// @access  Private
const createBooking = async (req, res, next) =>{
    const {event : eventId, seats} = req.body;
    const userId = req.user.userId;

    let session;

    try{
        session = await mongoose.startSession();
        session.startTransaction();

        const event = await Event.findById(eventId).session(session)
        if(!event){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: 'Event not found'
        });
        }

        if(event.organizer.toString() === userId.toString()){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'You cannot book your own event'
            })
        }

        const existingBooking = await Booking.findOne({ event: eventId, user: userId }).session(session);
        if (existingBooking) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'You have already booked this event' });
    }        

        const booking = new Booking({event: eventId, user: userId, seats});
        await booking.save({session});

        event.availableSeats -= seats;
        await event.save({session});

        
        const user = await User.findById(userId);
        try{
            await sendEmail({
                to: user.email,
                subject: 'Booking Confirmation',
                text: `Your booking for ${event.title} is confirmed.  Seats: ${seats}`,
                html: `<p>Your booking for <b>${event.title}</b> is confirmed. Seats: ${seats}</p>`
            })
        }catch(error){
            console.error('Error sending booking confirmation email:', error)
            
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
             message: 'Booking created successfully',
            booking
        });

    }catch (error){
        if(session){
            await session.abortTransaction();
            session.endSession();
        }
        next(error);
    }
}


// @desc    Delete a booking
// @route   DELETE /bookings/:id
// @access  Private
const deleteBooking = async (req, res, next) => {
    const bookingId = req.params.id;
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) {
        await session.abortTransaction();
        session.endSession();
        return next({ status: 404, message: 'Booking not found' });
      }
  
     if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
        await session.abortTransaction();
        session.endSession();
        return next({ status: 403, message: 'Unauthorized: You can only delete your own bookings' });
      }
  
      const event = await Event.findById(booking.event).session(session);
      if (!event) {
         await session.abortTransaction();
         session.endSession();
         return next({ status: 400, message: 'Event for this booking not found' });
      }
  
    
      event.availableSeats += booking.seats;
      await event.save({ session });
  
      await Booking.findByIdAndDelete(bookingId).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {

      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      next(error);
    }
  };


export {createBooking, getMyBookings, getAllBookings, getBookingById, deleteBooking};