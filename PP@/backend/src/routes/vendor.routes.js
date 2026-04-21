import { Router } from 'express';
import { loginVendor, registerVendor } from '../controllers/vendor.controller.js';

const router = Router();

router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);

export default router;
