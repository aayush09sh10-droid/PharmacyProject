import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler.util"
import { User } from "../models/user.model"


const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token = req.header("Authorization")?.replace("Bearer","")
    if(!token){
        throw new ApiError(401,"uNAUTHORIZED")

    }

    const decoded =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user =await User.findById(decoded._id.select("-password -refreshToken"))
    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }
    req.user = user
    next()

})