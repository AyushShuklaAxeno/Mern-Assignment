import express from 'express';
import { loginUser, registerUser, logoutUser } from './auth.controller.js';

export const authRoutes = express.Router();

authRoutes.post('/login', loginUser);
authRoutes.post('/register', registerUser);
authRoutes.post('/logout', logoutUser);
