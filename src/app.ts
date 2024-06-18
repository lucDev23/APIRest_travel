import express from 'express';
import mongoose from 'mongoose';
import User from './models/User';
import authRoutes from './routes/auth';

const app = express();

const MONGODB_URI =
    'mongodb+srv://gonzalez23lucas:p1wWDDjyHGfub9G6@cluster0.zgd0tgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const PORT = 3000;

app.use(express.json());

app.use(authRoutes);

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
