import { body, validationResult } from "express-validator";

const registerUserValidator = [
  body('first_name').notEmpty().trim().isLength({ min: 3, max: 20 }).withMessage('First name must be between 3 and 20 characters'),
  body('last_name').notEmpty().trim().isLength({ min: 3, max: 20 }).withMessage('Last name must be between 3 and 20 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  (req, res, next) =>{
     const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: 'validation error',
            errors: errors.array()
        })
      }
      next();
  }
];

const loginUserValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: 'Validation error',
            errors: errors.array 
        })
    }
    next();
  }
];

const createEventValidator = [
  body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description').notEmpty().trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
  body('date').notEmpty().isISO8601().toDate().withMessage('Invalid date format'),
  body('time').notEmpty().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('location').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Location must be between 1 and 200 characters'),
  body('availableSeats').isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer'),
  body('ticketPrice').isFloat({ min: 0 }).withMessage('Ticket price must be a non-negative number')
];

const updateEventValidator = [
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
    body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
    body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
    body('location').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Location must be between 1 and 200 characters'),
    body('availableSeats').optional().isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer'),
    body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price must be a non-negative number')
];

const createBookingValidator = [
  body('event').notEmpty().isMongoId().withMessage('Event ID is required and must be a valid MongoDB ObjectId'),
  body('seats').isInt({ min: 1 }).withMessage('Number of seats must be at least 1')
];

export {registerUserValidator, loginUserValidator, createEventValidator , updateEventValidator, createBookingValidator}