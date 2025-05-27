
import express from "express";
import dotenv from "dotenv";
import connectMongoDb from "./database/mongo_connection.js";
import userRouter from "./route/userRoutes.js";
import bookingRouter from "./route/bookingRoutes.js";
import eventRouter from "./route/eventRoutes.js";


dotenv.config();
const app = express();
connectMongoDb();


app.use(express.json())
app.use(express.urlencoded(
    {extended: true}
))
app.use('/evently/user/', userRouter);
app.use('/evently/event/', eventRouter);
app.use('/evently/booking', bookingRouter)

app.get('/evently', (req,res)=>{
    res.status(200).json(
        {message: "Welcome to our event booking app"}
    )
})

const port = process.env.PORT || 3001

app.listen(port, ()=>{
    console.log(`port running on localhost: ${port}`)
})