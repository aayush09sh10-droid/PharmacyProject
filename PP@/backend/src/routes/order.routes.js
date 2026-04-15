import { Router } from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus 
} from '../controllers/order.controller.js';

const router = Router();

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:id").get(getOrderById).patch(updateOrderStatus);

export default router;
