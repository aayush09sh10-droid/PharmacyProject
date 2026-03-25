import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.util";
import router from "../routes/user.routes";
import { ApiResponse } from "../utils/apiResponse";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user =await User.findOne(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave});
        return{accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError (500,"Something went wrong")
        
    }
}


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
        role,
        password,


    })
    const createdUsername=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUsername){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(201).json(
        new ApiResponse(201,"User Registered",createdUsername)
    )

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
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const option= {
        httpsOnly:true,
        secure:true,

    }
    return res.status(200)
    
    .json(new ApiResponse(200,
        {user:loggedInUser,accessToken},
        "User logged in"
    ))

    
})
const logoutUser=asyncHandler(async(req,res)=>{
    User.findUserAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },
        {
            new :true
        }
    )
    const option={
        httpsOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,"User Loggedout"))
})
const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        user: req.user
    })
})


export {registerUser,loginUser,logoutUser,getprofile}