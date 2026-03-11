import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // ... (rest same)
}, { timestamps: true });

export default mongoose.model('User', userSchema);
