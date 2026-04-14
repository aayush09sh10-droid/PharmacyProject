import { Router } from 'express';
import { loginVendor } from '../controllers/vendor.controller.js';

const router = Router();

router.route("/login").post(loginVendor);

export default router;
