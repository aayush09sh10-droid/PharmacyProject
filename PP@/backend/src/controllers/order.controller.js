import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const getVendorProductIds = async (vendorId) => {
    const products = await Product.find({ vendor: vendorId }).select("_id");
    return products.map((product) => product._id);
};

const createOrder = asyncHandler(async (req, res) => {
    const { customerName, items, totalAmount } = req.body;

    if (!customerName || !items || !totalAmount) {
        throw new ApiError(400, "All fields are required");
    }

    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const order = await Order.create({
        orderId,
        customerName,
        items,
        totalAmount
    });

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const isInternalRequest = req.headers["x-api-key"] && req.headers["x-api-key"] === process.env.INTERNAL_API_KEY;

    let orders = [];
    if (isInternalRequest) {
        orders = await Order.find().sort({ createdAt: -1 });
    } else {
        const vendorProductIds = await getVendorProductIds(req.user._id);
        orders = vendorProductIds.length > 0
            ? await Order.find({ "items.productId": { $in: vendorProductIds } }).sort({ createdAt: -1 })
            : [];
    }

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vendorProductIds = await getVendorProductIds(req.user._id);
    const order = vendorProductIds.length > 0
        ? await Order.findOne({ _id: id, "items.productId": { $in: vendorProductIds } })
        : null;

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const vendorProductIds = await getVendorProductIds(req.user._id);

    const order = await Order.findOneAndUpdate(
        { _id: id, "items.productId": { $in: vendorProductIds } },
        {
            $set: {
                status,
                paymentStatus
            }
        },
        { new: true }
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    );
});

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
}
