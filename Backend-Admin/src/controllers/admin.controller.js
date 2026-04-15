import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler.util";


const approveVendorVerification = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }
    
    vendor.verificationStatus = "approved";
    vendor.isApproved = true;
    await vendor.save();
    
    return res.status(200).json(
        new ApiResponse(200, vendor, "Vendor approved successfully")
    );
});

export { approveVendorVerification };
