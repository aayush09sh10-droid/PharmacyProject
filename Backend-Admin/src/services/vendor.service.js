import axios from "axios"
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.js";

const VENDOR_BASE_URL = "http://localhost:8001/api";
const getAllVendors = async ()=>{
    try {
        const response = await axios.get(`${VENDOR_BASE_URL}/vednor`);
        return response.data;

        
    } catch (error) {

        console.error("Error fetching vendor:");

        throw error;
        
    }

}

const approveVendor = asyncHandler(async(vendorId)=>{
    try {
        const response = await axios.patch(
            `${VENDOR_BASE_URL}/vendor/${vendorId}/verify`,{},
            {
                headers:{
                    "x-api-key":process.env.INTERNAL_API_KEY
                }
            }
        );
        return response.data;

        
    } catch (error) {
       throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || "failed to verify vedndor"
       )
        
    }
})

const getAllMedicines = asyncHandler(async()=>{
    try {
        const response = await axios.get(`${VENDOR_BASE_URL}/admin/medicines`,
            {
                headers:{
                    "x-api-key": process.env.INTERNAL_API_KEY
                }
            }
        )
        
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || "Failed to fetch medicines"
        );
        
    }
})

const getAnalytics=asyncHandler(async(req,res)=>{
    try {
        const response = await axios.get(
            `${VENDOR_BASE_URL}/admin/analytics`,
            {
                headers: {
                    "x-api-key": process.env.INTERNAL_API_KEY
                }
            }
        );
        
    } catch (error) {

        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || "Failed to fetch analytics"
        );
        
    }
})


export {getAllVendors,approveVendor,getAllMedicines}