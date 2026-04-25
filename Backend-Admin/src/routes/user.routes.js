import {
  askAiAssistant,
  cancelCustomerOrder,
  changePassword,
  fetchCustomerOrders,
  getProfile,
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
} from "../controllers/user.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"



// register Controller Route
const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/me").get(verifyJWT, getProfile).patch(verifyJWT, updateProfile)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/orders").get(verifyJWT, fetchCustomerOrders)
router.route("/orders/:id/cancel").patch(verifyJWT, cancelCustomerOrder)
router.route("/ai-assistant").post(askAiAssistant)


export default router
