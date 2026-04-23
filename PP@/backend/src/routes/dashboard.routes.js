import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { checkVendorVerification, verifyInternalRequest, verifyVendorJWT } from '../middleware/vendor.middleware.js';

const router = Router();

router.route("/stats").get(verifyVendorJWT, checkVendorVerification, getDashboardStats);
router.route("/admin/stats").get(verifyInternalRequest, getDashboardStats);

export default router;
