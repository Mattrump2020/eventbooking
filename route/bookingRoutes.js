import { Router } from "express";
import {createBooking, getMyBookings, getAllBookings, getBookingById, deleteBooking} from "../controller/bookingController.js";
import { createBookingValidator } from "../middleware/validator.js";
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'

const bookingRouter = Router();

bookingRouter.get('/allBookings', authMiddleware, roleMiddleware('admin'), getAllBookings);
bookingRouter.post('/newBooking', authMiddleware, createBookingValidator, createBooking);
bookingRouter.get('/mybookings', authMiddleware, getMyBookings);
bookingRouter.get('/admin/:id', authMiddleware, roleMiddleware('admin'), getBookingById);
bookingRouter.delete('/delete/:id', authMiddleware, roleMiddleware('admin'), deleteBooking);


export default bookingRouter;