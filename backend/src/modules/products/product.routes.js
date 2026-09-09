import express from 'express';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { addProduct, deleteProduct, fetchAllProducts, fetchNewArrivals, fetchProductById, updateProduct } from './products.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';

export const productRouter = express.Router();

productRouter.get('/', fetchAllProducts)
productRouter.get('/new-arrivals', fetchNewArrivals)
productRouter.get('/:id', fetchProductById)

productRouter.post('/', authMiddleware, roleMiddleware('admin'), upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 5 }
]), addProduct)

productRouter.delete('/', authMiddleware, roleMiddleware('admin'), deleteProduct)

productRouter.patch('/', authMiddleware, roleMiddleware('admin'), updateProduct)

