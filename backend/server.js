import express from 'express';
import dotenv from "dotenv"; 
import todoRoutes from "./routes/todo.routes.js"
import { connectDB } from './config/db.js';

dotenv.config(); 

const app = express();

app.use(express.json());

// Add root route
app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to MERN Todo API!", 
        version: "1.0.0",
        endpoints: {
            todos: "/api/todos"
        }
    });
});

app.use("/api/todos", todoRoutes)

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000")
})