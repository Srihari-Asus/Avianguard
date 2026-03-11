import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

router.get('/:uid', userController.getUserProfile);
router.post('/', userController.createOrUpdateProfile);

export default router;
