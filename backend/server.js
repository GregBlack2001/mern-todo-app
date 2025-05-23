import express from 'express';
import dotenv from "dotenv"; 
import todoRoutes from "./routes/todo.routes.js"
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); 

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use("/api/todos", todoRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});

export default app;