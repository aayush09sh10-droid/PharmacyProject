import { User } from "../../../../Backend-Admin/src/models/user.model";
import { ApiError } from "../../../../Backend-Admin/src/utils/apiError";
import { ApiResponse } from "../../../../Backend-Admin/src/utils/apiResponse";
import { asyncHandler } from "../../../../Backend-Admin/src/utils/asyncHandler.util";
import {Vendor} from "../models/vendor.model";


const giveRequestOfVerification = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }
    
    if (vendor.verificationStatus === "pending") {
        throw new ApiError(400, "Verification request already pending");
    }
    
    vendor.verificationStatus = "pending";
    vendor.isApproved = false;
    await vendor.save();
    
    return res.status(200).json(
        new ApiResponse(200, vendor, "Verification request sent to admin")
    );
});

