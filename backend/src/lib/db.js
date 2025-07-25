import mongoose from "mongoose";

export const connectDB=async ()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected:${conn.connection.host}`);
    }catch(err){
        console.log("Error connecting to mongodb",err);
    }
};