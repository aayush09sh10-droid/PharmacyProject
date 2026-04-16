import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Vendor } from "../models/vendor.model";

const verifyVendor = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const vendor =await Vendor.findById(id);

    if(!Vendor){
        throw new ApiError(400,"Vendor not found");

    }
    vendor.status = "approved";
    await vendor.save();

    return res.status(200).json(
        new ApiResponse(200,"Vendor verified successfully")

    );
});
export {verifyVendor}