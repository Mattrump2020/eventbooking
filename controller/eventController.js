import event from '../model/event.js'
import Event from '../model/event.js'
import User from '../model/user.js'


// @desc    Create a new event
// @route   POST /events
// @access  Private (Admin only)
const createEvent = async (req, res, next) => {
    
    const {title, description, date, time, location, availableSeats, ticketPrice} = req.body
    const organizer = req.user.userId 

    try {
        const user = await User.findById(organizer);
        if(!user){
            return res.status(404).json({error: 'Organizer not found'})
        }

        if(!title || !description|| !location || !date || !time){
            return res.status(400).json({error: 'Title, description, location and date are required'})
        }

        const existingEvent = await Event.findOne({title, location, date})
        if(existingEvent){
           return res.status(409).send("Event already exist")
        }

        const newEvent = new Event ({title, description, date, time, location, availableSeats, ticketPrice, organizer})
        await newEvent.save()
        
        res.status(201).json({message: "Event created", event : newEvent})
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Server Error'})
    } 

}

// @desc    Get all events
// @route   GET /events
// @access  Public
const getAllEvents = async (req,res, next) =>{
    try{
        const events = await Event.find().populate('organizer', 'name email');
        res.status(200).json(events);
    } catch (error){
        next(error);
    }
}

// @desc    Get a single event
// @route   GET /events/:id
// @access  Public
const getEventById = async (req, res, next) => {
    try{
        const event = await Event.findById(req.params.id).populate('organizer', 'name email')
        if (!event){
            return res.status(404).send('Event Not found')
        }
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
}

// @desc    Update an event
// @route   PUT /events/:id
// @access  Private (Admin only)

const updateEvent = async (req, res, next) => {
    try{
        
        const { title, description, date, time, location, availableSeats, ticketPrice} = req.body
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if(!event) 
            return res.status(404).send('Event not Found')

        if(event.organizer.toString() !== req.user.userId.toString()){
            return res.status(403).json ({
                message: 'Unauthorized: You are not the organizer of this event'
            })
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {title, description, date, time, location, availableSeats, ticketPrice},
            {new: true, runValidators: true}
        )
        
        if(!updatedEvent) {
            return res.status(404).send('Event not found')
        }

        res.status(200).json({message: 'Event updated successfully', event: updateEvent})
    } catch (error){
        next(error)
}
}


// @desc    Delete an event
// @route   DELETE /events/:id
// @access  Private (Admin only)
const deleteEvent = async (req, res, next) =>{
    const eventId = req.params.id
    try{
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Event not found')
        } 
        if (event.organizer.toString() !== req.user.userId.toString()) {
            return res.status(403).json ({
                message: 'Unauthorized: You are not the organizer of this event'
            })
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if(!deletedEvent){
            res.status(404).json({
                message: 'Event not Found' 
            })   
        }
        res.status(200).json({message: 'Event deleted sucessfully'});
    }catch(error){
        next(error);
    }

}

export {createEvent, getAllEvents, getEventById, updateEvent, deleteEvent}