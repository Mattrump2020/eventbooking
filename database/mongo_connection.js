import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

function connectMongoDb (){
    const mongodb_connection = process.env.MONGODB_CONNECTION
    if (!mongodb_connection)
        throw new Error ("MongoDB connection string is missing in environment variables")

    try{

        mongoose.connect(mongodb_connection);
    
        mongoose.connection.on("connected", (req, res)=>{
            console.log("MongoDb connected successfully...")
        })
    
        mongoose.connection.on("disconnected", (req, res)=>{
            console.log("MongoDb disconnected...")
        })

        mongoose.connection.on("error", (err) =>{
            console.error("MongoDb connetion error:", err.message)
        })
    }
    catch (error){
        console.error("Failed to initialize MongoDb connection: ", error.message )
    }
}
export default connectMongoDb;