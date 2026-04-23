import jwt from "jsonwebtoken";
import { Vendor } from "../models/vendor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyVendorJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }

    const vendor = await Vendor.findById(decoded._id).select("-password -refreshToken");

    if (!vendor) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = vendor;
    next();
});

const checkVendorVerification = asyncHandler(async(req,res,next)=>{
    if (req.user.status !== "approved"){
        throw new ApiError(403,"Vendor not verified ")
    }
    next();
})
 const verifyInternalRequest = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
};
export { checkVendorVerification, verifyInternalRequest, verifyVendorJWT }
