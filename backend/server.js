// Updated backend/server.js
import express from 'express';
import dotenv from "dotenv"; 
import todoRoutes from "./routes/todo.routes.js"
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

dotenv.config(); 

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Build frontend in production
if (process.env.NODE_ENV === 'production') {
    try {
        console.log('Building frontend...');
        execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
        console.log('Frontend built successfully!');
    } catch (error) {
        console.log('Frontend build error:', error.message);
    }
}

// API routes FIRST
app.use("/api/todos", todoRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    console.log('Serving static files from:', frontendPath);
    
    app.use(express.static(frontendPath));
    
    // Handle React routing - this should come AFTER API routes
    app.get('*', (req, res) => {
        console.log('Serving React app for route:', req.url);
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    // Development root route
    app.get('/', (req, res) => {
        res.json({ 
            message: "Welcome to MERN Todo API!", 
            version: "1.0.0",
            endpoints: {
                todos: "/api/todos"
            }
        });
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});

export default app;