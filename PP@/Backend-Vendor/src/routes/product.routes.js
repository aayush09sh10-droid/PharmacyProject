import { Router } from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller.js';
import { verifyVendor } from '../controllers/verifyVendor.controller.js';
import { verifyInternalRequest } from '../middleware/vendor.middleware.js';
import { getAdminAnalytics } from '../controllers/getAnalytics.controller.js';

const router = Router();

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").get(getProductById).patch(updateProduct).delete(deleteProduct);
router.get("/admin/medicines",verifyInternalRequest);
router.get("/admin/analytics",verifyInternalRequest,getAdminAnalytics)

export default router;
