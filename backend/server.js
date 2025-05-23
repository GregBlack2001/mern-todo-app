import express from 'express';
import dotenv from "dotenv"; 
import todoRoutes from "./routes/todo.routes.js"
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

dotenv.config(); 

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);

// Build frontend in production
if (process.env.NODE_ENV === 'production') {
    const frontendDir = path.join(__dirname, '../frontend');
    const distDir = path.join(frontendDir, 'dist');
    
    console.log('Frontend directory:', frontendDir);
    console.log('Dist directory:', distDir);
    
    // Check if frontend directory exists
    if (fs.existsSync(frontendDir)) {
        console.log('✅ Frontend directory exists');
        
        try {
            console.log('🔨 Building frontend...');
            execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
            console.log('✅ Frontend built successfully!');
            
            // Check if dist was created
            if (fs.existsSync(distDir)) {
                console.log('✅ Dist directory created');
                const files = fs.readdirSync(distDir);
                console.log('📁 Files in dist:', files);
            } else {
                console.log('❌ Dist directory not found after build');
            }
        } catch (error) {
            console.log('❌ Frontend build error:', error.message);
        }
    } else {
        console.log('❌ Frontend directory not found');
    }
}

// API routes FIRST
app.use("/api/todos", todoRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    console.log('🎯 Attempting to serve static files from:', frontendPath);
    
    if (fs.existsSync(frontendPath)) {
        console.log('✅ Frontend dist directory exists');
        app.use(express.static(frontendPath));
        
        // Handle React routing
        app.get('*', (req, res) => {
            const indexPath = path.join(frontendPath, 'index.html');
            console.log('🔄 Serving React app for route:', req.url);
            console.log('📄 Index.html path:', indexPath);
            
            if (fs.existsSync(indexPath)) {
                console.log('✅ Index.html exists, serving it');
                res.sendFile(indexPath);
            } else {
                console.log('❌ Index.html not found');
                res.json({ error: 'Frontend files not found' });
            }
        });
    } else {
        console.log('❌ Frontend dist directory does not exist');
        
        // Fallback response
        app.get('*', (req, res) => {
            res.json({ 
                error: "Frontend not built",
                message: "Welcome to MERN Todo API!", 
                version: "1.0.0",
                endpoints: {
                    todos: "/api/todos"
                }
            });
        });
    }
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
    console.log(`🚀 Server started on port ${PORT}`);
});

export default app;