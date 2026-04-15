import { Router } from 'express';
import { loginVendor } from '../controllers/vendor.controller.js';
import { giveRequestOfVerification } from '../controllers/request.controller.js';


const router = Router();

router.route("/login").post(loginVendor);
router.route("/request").post(giveRequestOfVerification)

export default router;
