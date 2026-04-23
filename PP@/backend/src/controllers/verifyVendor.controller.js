import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Vendor } from "../models/vendor.model.js";
import { Product } from "../models/product.model.js";

const verifyVendor = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const vendor =await Vendor.findById(id);

    if(!vendor){
        throw new ApiError(400,"Vendor not found");

    }
    vendor.status = "approved";
    await vendor.save();

    return res.status(200).json(
        new ApiResponse(200, vendor, "Vendor verified successfully")

    );
});
const getAllMedicinesForAdmin = asyncHandler(async(req,res,next)=>{
    const medicines = await Product.find().sort({ createdAt: -1 })
        .populate("vendor","pharmacyName email status");

    return res.status(200).json(
        new ApiResponse(200,medicines,"All medicines fetched for admin")
    );
});

export { getAllMedicinesForAdmin, verifyVendor }
