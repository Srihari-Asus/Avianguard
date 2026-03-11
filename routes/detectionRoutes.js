import express from 'express';
const router = express.Router();
import * as detectionController from '../controllers/detectionController.js';

router.post('/', detectionController.logDetection);
router.get('/:userId', detectionController.getLogs);

export default router;
