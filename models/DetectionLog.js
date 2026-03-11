import mongoose from 'mongoose';

const detectionLogSchema = new mongoose.Schema({
    // ... (rest same)
}, { timestamps: true });

export default mongoose.model('DetectionLog', detectionLogSchema);
