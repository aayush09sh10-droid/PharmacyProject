import express from "express"
import { loginUser,registerUser,logoutUser } from "../controllers/user.controller.js"
import { fetchVendor } from "../controllers/admin.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"



// register Controller Route
const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
// router.route("/vendorVerification").post(approveVendorVerification)
router.get("/vendors", fetchVendor);


export default router