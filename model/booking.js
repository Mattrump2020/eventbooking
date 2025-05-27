import mongoose from "mongoose";
import event from "./event.js";

const bookingSchema = new mongoose.Schema ({
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'Event', 
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    seats: {
        type: Number, 
        required: true,
        min: 1
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }

}, {timestamps : true});


bookingSchema.index({event: 1, user: 1}, {unique: true})

export default mongoose.model('Booking', bookingSchema)