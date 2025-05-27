import { Router } from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controller/eventController.js";
import { createEventValidator, updateEventValidator } from "../middleware/validator.js";

const eventRouter = Router();

eventRouter.get('/all', getAllEvents);
eventRouter.get('/:id', getEventById);
eventRouter.post('/create',authMiddleware, roleMiddleware('admin'), createEventValidator, createEvent );
eventRouter.put('/update/:id', authMiddleware, roleMiddleware('admin'), updateEventValidator, updateEvent);
eventRouter.delete('/delete/:id',authMiddleware,roleMiddleware('admin'), deleteEvent);


export default eventRouter
