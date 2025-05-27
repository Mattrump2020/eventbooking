import {Router} from "express";
import {signUp, signIn, getMe, signOut} from "../controller/userController.js";
import {registerUserValidator, loginUserValidator} from '../middleware/validator.js'
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/signUp', registerUserValidator ,signUp);
userRouter.post('/signIn', loginUserValidator, signIn);
userRouter.get('/me', authMiddleware, getMe)
userRouter.post('/logout',authMiddleware, signOut)

export default userRouter