import express, { Request } from 'express';
import * as authController from '../controllers/auth';
import { body } from 'express-validator';
import passport, { authenticate } from 'passport';
import { validateSignupInputs, validateLoginInputs } from '../validation/auth';

const router = express.Router();

router.post('/signup', validateSignupInputs, authController.signup);

router.post('/login', validateLoginInputs, authController.login);

export default router;
