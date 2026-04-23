import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Vendor } from "../models/vendor.model.js";

const productVendorSelect = "pharmacyName ownerName phone email status";

const createProduct = asyncHandler(async (req, res) => {
    const { name, category, stock, price, expiry, rxRequired, description } = req.body;

    if (!name || !category || stock === undefined || price === undefined || !expiry) {
        console.log("Validation Failed:", { name, category, stock, price, expiry });
        throw new ApiError(400, "Name, category, stock, price, and expiry are required");
    }

    const product = await Product.create({
        vendor: req.user._id,
        name,
        category,
        stock,
        price,
        expiry,
        rxRequired,
        description
    });

    const createdProduct = await Product.findById(product._id).populate("vendor", productVendorSelect);

    return res.status(201).json(
        new ApiResponse(201, createdProduct, "Product created successfully")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ vendor: req.user._id })
        .sort({ name: 1 })
        .populate("vendor", productVendorSelect);

    return res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

const getPublicCatalog = asyncHandler(async (req, res) => {
    const approvedVendors = await Vendor.find({ status: "approved" })
        .select("pharmacyName ownerName phone")
        .sort({ pharmacyName: 1 });

    const approvedVendorIds = approvedVendors.map((vendor) => vendor._id);
    const products = await Product.find({ vendor: { $in: approvedVendorIds } })
        .sort({ name: 1 })
        .populate("vendor", "pharmacyName ownerName phone");

    const catalog = approvedVendors.map((vendor) => {
        const vendorProducts = products.filter(
            (product) => String(product.vendor?._id) === String(vendor._id),
        );

        return {
            _id: vendor._id,
            pharmacyName: vendor.pharmacyName,
            ownerName: vendor.ownerName,
            phone: vendor.phone,
            products: vendorProducts.map((product) => ({
                _id: product._id,
                name: product.name,
                category: product.category,
                stock: product.stock,
                price: product.price,
                expiry: product.expiry,
                rxRequired: product.rxRequired,
                description: product.description,
                vendor: product.vendor,
            })),
        };
    }).filter((vendor) => vendor.products.length > 0);

    return res.status(200).json(
        new ApiResponse(200, catalog, "Public catalog fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("vendor", productVendorSelect);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, stock, price, expiry, rxRequired, description } = req.body;

    const product = await Product.findOneAndUpdate(
        { _id: id, vendor: req.user._id },
        {
            $set: {
                name,
                category,
                stock,
                price,
                expiry,
                rxRequired,
                description
            }
        },
        { new: true }
    ).populate("vendor", productVendorSelect);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, vendor: req.user._id });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});

export {
    createProduct,
    getAllProducts,
    getPublicCatalog,
    getProductById,
    updateProduct,
    deleteProduct
}
