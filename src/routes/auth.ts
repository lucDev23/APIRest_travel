import express from 'express';
import * as authController from '../controllers/auth';

const router = express.Router();

router.get('/register', authController.postRegister);

export default router;
