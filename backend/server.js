import express from "express";
import mongoose from  "mongoose";
import "dotenv/config";
import {Log} from "./models/log.js";
import logsRoutes from "./routes/logs.routes.js";
const app = express();
const PORT = 3000;

await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to DB...");

const getTenantUid = ()=>{
   return typeof process.getuid === "function" ? process.getuid() : 1000;
}

app.use('/logs', logsRoutes);

app.get("/health" , (req, res)=>{
    res.json({status : "ok"});
});

app.listen(PORT, ()=>{
    console.log(`Log server running on ${PORT}`);
});