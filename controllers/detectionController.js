import DetectionLog from '../models/DetectionLog.js';

export const logDetection = async (req, res) => {
    try {
        const log = new DetectionLog(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLogs = async (req, res) => {
    try {
        const logs = await DetectionLog.find({ userId: req.params.userId }).sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
