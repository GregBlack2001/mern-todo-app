import express from 'express';
import dotenv from "dotenv"; 
import todoRoutes from "./routes/todo.routes.js"
import { connectDB } from './config/db.js';

dotenv.config(); 

const app = express();

app.use(express.json());


app.use("/api/todos", todoRoutes)

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000")
})