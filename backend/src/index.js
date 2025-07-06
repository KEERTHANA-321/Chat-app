import express from "express";
import dotenv from "dotenv";
import cookieParsor from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import teamRoutes from "./routes/team.routes.js"

import cors from "cors";

import { connectDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js";

app

dotenv.config();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParsor());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/teams",teamRoutes);


const PORT=process.env.PORT;
server.listen(PORT,()=>{
    console.log("server is running on http://localhost:"+PORT);
    connectDB();
})
