import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Vendor } from "../models/vendor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const loginVendor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
        throw new ApiError(404, "Vendor does not exist");
    }

    const isPasswordValid = await vendor.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid vendor credentials");
    }

    const accessToken = vendor.generateAccessToken();
    const refreshToken = vendor.generateRefreshToken();

    vendor.refreshToken = refreshToken;
    await vendor.save({ validateBeforeSave: false });

    const loggedInVendor = await Vendor.findById(vendor._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    vendor: loggedInVendor,
                    accessToken,
                    refreshToken
                },
                "Vendor logged in successfully"
            )
        );
});

export {
    loginVendor
}
