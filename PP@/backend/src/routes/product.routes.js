import { Router } from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller.js';

const router = Router();

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").get(getProductById).patch(updateProduct).delete(deleteProduct);

export default router;
