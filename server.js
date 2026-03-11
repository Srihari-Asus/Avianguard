import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/avianguard')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'AvianGuard API is active' });
});

// Import Routes
import userRoutes from './routes/userRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/detections', detectionRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
