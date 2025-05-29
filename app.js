
import express from "express";
import dotenv from "dotenv";
import connectMongoDb from "./database/mongo_connection.js";
import userRouter from "./route/userRoutes.js";
import bookingRouter from "./route/bookingRoutes.js";
import eventRouter from "./route/eventRoutes.js";
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import cors from 'cors';



const swaggerDocument = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf-8'));

dotenv.config();
const app = express();
connectMongoDb();

app.use(cors({ origin: 'http://localhost:2500' }));

app.use(express.json())
app.use(express.urlencoded(
    {extended: true}
))

app.use('/evently/user/', userRouter);
app.use('/evently/event/', eventRouter);
app.use('/evently/booking', bookingRouter)
app.use((err, req, res, next) => {
  console.error(err.stack); // This logs the actual error
  res.status(500).json({ error: 'Server Error' });
});


app.get('/evently', (req,res)=>{
    res.status(200).json(
        {message: "Welcome to our event booking app"}
    )
})

//API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3001

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger Docs: http://localhost:${port}/docs`);
})