import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { addCategory, deleteCategory, fetchAllCategories } from './categories.controller.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';

export const categoriesRouter = express.Router();



categoriesRouter.get('/', fetchAllCategories)
categoriesRouter.post('/', authMiddleware, roleMiddleware('admin'), addCategory)
categoriesRouter.delete('/', authMiddleware, roleMiddleware('admin'), deleteCategory)