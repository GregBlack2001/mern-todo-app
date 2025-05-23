import express from 'express';
import dotenv from "dotenv"; 
import todoRoutes from "./routes/todo.routes.js"
import { connectDB } from './config/db.js';

dotenv.config(); 

const app = express();

app.use(express.json());

// API routes
app.use("/api/todos", todoRoutes);

// Simple root route for API testing
app.get('/api', (req, res) => {
    res.json({ 
        message: "Welcome to MERN Todo API!", 
        version: "1.0.0",
        endpoints: {
            todos: "/api/todos"
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on port ${PORT}`);
});

export default app;