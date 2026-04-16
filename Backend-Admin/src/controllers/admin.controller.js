import { approveVendor, getAllVendors } from "../services/vendor.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { getAllMedicines } from "../services/vendor.service.js";



const fetchVendor = asyncHandler(async()=>{
    try {
        const vendor = await getAllVendors()
        res.json(vendor);
        
        
    } catch (error) {
        throw new ApiError(500,("can not fetch data"))

        
    }
})

const approveVendorController =asyncHandler(async(req,res)=>{
    const {id }=req.params;
    const response = approveVendor(id);
    return res.status(200).json(
        new ApiResponse(200,response.data,"Vendor Verification successfull")
    )
})

const getAllMedicinesController =asyncHandler(async(req,res)=>{
    const response = await getAllMedicines();
    return res.status(200).json(
        new ApiResponse(200, response.data, "All medicines fetched")
    );

})


// const approveVendorVerification = asyncHandler(async (req, res) => {
//     const {vendorId }=req.params;
    
//     const { vendorId } = req.params;
    
//     const vendor = await Vendor.findById(vendorId);
//     if (!vendor) {
//         throw new ApiError(404, "Vendor not found");
//     }
    
//     vendor.verificationStatus = "approved";
//     vendor.isApproved = true;
//     await vendor.save();
    
//     return res.status(200).json(
//         new ApiResponse(200, vendor, "Vendor approved successfully")
//     );
// });


// })

export {  fetchVendor,approveVendorController,getAllMedicinesController };
