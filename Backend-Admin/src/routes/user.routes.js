import { askAiAssistant, fetchCustomerOrders, loginUser,registerUser,logoutUser } from "../controllers/user.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"



// register Controller Route
const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/orders").get(verifyJWT, fetchCustomerOrders)
router.route("/ai-assistant").post(askAiAssistant)


export default router
