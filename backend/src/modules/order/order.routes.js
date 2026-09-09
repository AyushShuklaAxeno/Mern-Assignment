import express from 'express'
import { changeOrderStatus, fetchAllOrders, fetchMyOrders, placeOrder } from './order.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'

export const orderRouter = express.Router()

orderRouter.post('/', authMiddleware, placeOrder)
orderRouter.get('/admin', authMiddleware, roleMiddleware('admin'), fetchAllOrders);
orderRouter.get('/my-orders', authMiddleware, fetchMyOrders)
orderRouter.get('/my-order', authMiddleware, fetchMyOrders)
orderRouter.patch('/change-status/:order_id', authMiddleware, roleMiddleware('admin'), changeOrderStatus)