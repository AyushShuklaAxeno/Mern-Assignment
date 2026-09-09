import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getUserInfo, updateUserProfile, updateUserAddress } from './user.controller.js';

export const userRoutes = express.Router();

userRoutes.get('/', authMiddleware, getUserInfo);
userRoutes.put('/profile', authMiddleware, updateUserProfile);
userRoutes.put('/address', authMiddleware, updateUserAddress);