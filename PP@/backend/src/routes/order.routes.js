import { Router } from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus 
} from '../controllers/order.controller.js';
import { checkVendorVerification, verifyInternalRequest, verifyVendorJWT } from '../middleware/vendor.middleware.js';

const router = Router();

router.route("/").get(verifyVendorJWT, checkVendorVerification, getAllOrders).post(createOrder);
router.route("/admin/all").get(verifyInternalRequest, getAllOrders);
router.route("/admin/:id").patch(verifyInternalRequest, updateOrderStatus);
router.route("/:id")
    .get(verifyVendorJWT, checkVendorVerification, getOrderById)
    .patch(verifyVendorJWT, checkVendorVerification, updateOrderStatus);

export default router;
