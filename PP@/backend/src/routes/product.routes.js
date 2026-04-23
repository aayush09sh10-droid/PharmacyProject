import { Router } from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getPublicCatalog,
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller.js';
import { getAllMedicinesForAdmin } from '../controllers/verifyVendor.controller.js';
import { checkVendorVerification, verifyInternalRequest, verifyVendorJWT } from '../middleware/vendor.middleware.js';
import { getAdminAnalytics } from '../controllers/getAnalytics.controller.js';

const router = Router();

router.get("/catalog", getPublicCatalog);
router.route("/").get(verifyVendorJWT, checkVendorVerification, getAllProducts).post(verifyVendorJWT, checkVendorVerification, createProduct);
router.route("/:id")
    .get(getProductById)
    .patch(verifyVendorJWT, checkVendorVerification, updateProduct)
    .delete(verifyVendorJWT, checkVendorVerification, deleteProduct);
router.get("/admin/medicines", verifyInternalRequest, getAllMedicinesForAdmin);
router.get("/admin/analytics", verifyInternalRequest, getAdminAnalytics);

export default router;
