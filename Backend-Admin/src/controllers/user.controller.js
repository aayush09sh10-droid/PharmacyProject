import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.util";
import router from "../routes/user.routes";


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
const loginUser=asyncHandler(async(req,res)=>{
    //get data 
    //password match hash
    //login name exist?
    const {name,password,email}=req.body
    if (!name || !email){
        throw new ApiError(400,"user not exist")
    }
    const user= await User.findOne({
        $or:[{name},{email}]

    })
    if(!user){
        throw new ApiError(400,"User not found")

    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"Password incorrect")
    }

    
})


export {registerUser}