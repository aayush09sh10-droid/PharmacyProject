import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const checkVendorVerification = asyncHandler(async(req,res,next)=>{
    if (req.user.status !== "approved"){
        throw new ApiError(403,"Vendor not verified ")
    }
    next();
})
export {checkVendorVerification}