import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.util";

const registerUser= asyncHandler(async(req,res)=>{
    const {name,email,password,latitude,longitude,role}=req.body
    if(
        [name,email,password].some((field=>field?.trim()===""))
    ){
        throw new ApiError(400,"All compulsory fields are required")
    }


    const existedUser=await User.findOne({$or:[{name},{email}]})
    if(existedUser){
        throw new ApiError(409,"User already existed")
    }
    const user =await User.create({
        name,
        email,
        
        latitude,
        longitude,
        role

    })
})