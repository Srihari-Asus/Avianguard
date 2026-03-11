import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createOrUpdateProfile = async (req, res) => {
    try {
        const { uid, displayName, email, photoURL, onboarded, farmerProfile } = req.body;
        let user = await User.findOne({ uid });

        if (user) {
            user = await User.findOneAndUpdate({ uid }, req.body, { new: true });
        } else {
            user = new User({ uid, displayName, email, photoURL, onboarded, farmerProfile });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
