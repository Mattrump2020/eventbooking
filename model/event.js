import mongoose from 'mongoose';
import validator from 'validator';

const eventSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true, 
        trim: true, minlength:1, 
        maxlength: 200
    },
    location: {
        type: String, 
        required: true,
        trim: true,
        minlength: 1,
        maxlength:200
    },
    date: { 
        type: Date, 
        required: true,
        validate: {
            validator: (value) => value > new Date(), 
            message: 'Date must be in the future'
        }
    },
    description: {
        type: String, 
        required: true,
        trim: true,
        minlength: 1,
        maxlength:1000
    }, 
    time: {
        type: String,
        required: true,
        validate: {
          validator: (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
          message: 'Invalid time format (HH:MM)'
        }
      },
      availableSeats: {
        type: Number,
        required: true,
        min: 0
      },
      ticketPrice: {
        type: Number,
        required: true,
        min: 0
      },
      organizer: { //Added organizer field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
      }

}, {Timestamp: true})

export default mongoose.model ('Event', eventSchema)