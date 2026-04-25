import { Router } from "express";
import {
  fetchVendorNotifications,
  readAllVendorNotifications,
  readVendorNotification,
} from "../controllers/notification.controller.js";
import { checkVendorVerification, verifyVendorJWT } from "../middleware/vendor.middleware.js";

const router = Router();

router.use(verifyVendorJWT, checkVendorVerification);
router.get("/", fetchVendorNotifications);
router.patch("/read-all", readAllVendorNotifications);
router.patch("/:id/read", readVendorNotification);

export default router;
