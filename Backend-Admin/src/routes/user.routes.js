import express from "express"
import { Router } from "express"


// register Controller Route
const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)


export default router