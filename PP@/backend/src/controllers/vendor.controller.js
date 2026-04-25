import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Vendor } from "../models/vendor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notification.service.js";

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
        secure: process.env.NODE_ENV === "production"
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

const registerVendor = asyncHandler(async (req, res) => {
    const { email, password, pharmacyName, ownerName, phone } = req.body;

    if (
        [email, password, pharmacyName, ownerName, phone].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedVendor = await Vendor.findOne({ email });

    if (existedVendor) {
        throw new ApiError(409, "Vendor with this email already exists");
    }

    const vendor = await Vendor.create({
        email,
        password,
        pharmacyName,
        ownerName,
        phone
    });

    const createdVendor = await Vendor.findById(vendor._id).select("-password -refreshToken");

    if (!createdVendor) {
        throw new ApiError(500, "Something went wrong while registering the vendor");
    }

    await createNotification({
        recipientRole: "Admin",
        actorRole: "Vendor",
        actorId: createdVendor._id,
        title: "New vendor registration",
        message: `${createdVendor.pharmacyName} submitted a vendor registration request.`,
        entityType: "vendor",
        entityId: String(createdVendor._id),
        metadata: {
            pharmacyName: createdVendor.pharmacyName,
            ownerName: createdVendor.ownerName,
        },
    });

    return res.status(201).json(
        new ApiResponse(201, createdVendor, "Vendor registered successfully")
    );
});

const getAllVendors = asyncHandler(async (req, res) => {
    const vendors = await Vendor.find().sort({ createdAt: -1 }).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, vendors, "Vendors fetched successfully")
    );
});

const approveVendor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const vendor = await Vendor.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "approved"
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }

    await createNotification({
        recipientRole: "Vendor",
        recipientId: vendor._id,
        actorRole: "Admin",
        title: "Vendor account approved",
        message: `${vendor.pharmacyName} has been approved and can now manage products and orders.`,
        entityType: "vendor",
        entityId: String(vendor._id),
        metadata: {
            pharmacyName: vendor.pharmacyName,
            status: vendor.status,
        },
    });

    return res.status(200).json(
        new ApiResponse(200, vendor, "Vendor approved successfully")
    );
});

const deleteVendor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const vendor = await Vendor.findByIdAndDelete(id).select("-password -refreshToken");

    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }

    return res.status(200).json(
        new ApiResponse(200, vendor, "Vendor deleted successfully")
    );
});

export {
    loginVendor,
    registerVendor,
    getAllVendors,
    approveVendor,
    deleteVendor
}
