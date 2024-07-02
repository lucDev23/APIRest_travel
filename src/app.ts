import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from './models/User';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import cors from 'cors';
import passport from 'passport';
import './config/passport';
import { CustomValidationError } from './types/CustomValidationError';

const app = express();

const MONGODB_URI =
    'mongodb+srv://gonzalez23lucas:p1wWDDjyHGfub9G6@cluster0.zgd0tgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// ERROR HANDLER

app.use(
    (
        error: CustomValidationError,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        return res.json({ error: error.message, errors: error.errors });
    }
);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB ERROR: ', error);
    });
