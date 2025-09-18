import mongoose from "mongoose";

export const ConnectMongoDB=async()=>{
    try{
await mongoose.connect(process.env.MONGO_URI);
console.log("DB Connetcted")
  } catch (err) {
    console.log("DB Connection Errro");
  }
};