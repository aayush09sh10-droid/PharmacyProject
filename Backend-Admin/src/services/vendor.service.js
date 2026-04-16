import axios from "axios"

const VENDOR_BASE_URL = "http://localhost:8001/api";
export const getAllVendors = async ()=>{
    try {
        const response = await axios.get(`${VENDOR_BASE_URL}/vednor`);
        return response.data;

        
    } catch (error) {

        console.error("Error fetching vendor:");

        throw error;
        
    }

}