import express from 'express';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import path from 'path';

dotenv.config();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3001;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));



app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV == "production"){
  app.use(express.static(path.join(__dirname , "../frontend/dist")))

  app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
