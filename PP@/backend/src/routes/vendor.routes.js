import { Router } from 'express';
import { 
  loginVendor, 
  registerVendor,
  getCurrentVendor,
  updateCurrentVendor,
  changeVendorPassword,
  getAllVendors,
  approveVendor,
  deleteVendor
   
} from '../controllers/vendor.controller.js';
import { verifyInternalRequest, verifyVendorJWT } from '../middleware/vendor.middleware.js';

const router = Router();

router.route("/")
  .get(verifyInternalRequest, getAllVendors);
router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);
router.route("/me").get(verifyVendorJWT, getCurrentVendor).patch(verifyVendorJWT, updateCurrentVendor);
router.route("/change-password").patch(verifyVendorJWT, changeVendorPassword);
router.route("/:id/approve").patch(verifyInternalRequest, approveVendor);
router.route("/:id").delete(verifyInternalRequest, deleteVendor);
// router.route("/request").post(giveRequestOfVerification);

export default router;
