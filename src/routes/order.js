import {Router} from 'express';
import { isAuthorized, isAuthenticated, authorizeRole } from '../middlewares/auth.js';
import { 
  createOrder, 
  completeOrderAfterPayment,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  getAllOrders
} from '../controllers/order.js';

export const orderRouter = Router();


orderRouter.post('/order', isAuthenticated, createOrder);
orderRouter.post('/:orderId/payment', isAuthenticated, completeOrderAfterPayment);
orderRouter.get('/orders', isAuthenticated, getUserOrders);
orderRouter.get('/orders/:id', isAuthenticated, getOrderById);
orderRouter.get('/admin/all', isAuthenticated, authorizeRole("Administrator"),  getAllOrders);
orderRouter.put('/:id/status', isAuthenticated,isAuthorized("Administrator"), updateOrderStatus);

