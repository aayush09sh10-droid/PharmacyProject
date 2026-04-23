import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { customerId, customerName, customerEmail, items, paymentMethod, vendorId } = req.body;

    if (!customerName || !vendorId || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedItems = items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity || 0),
    })).filter((item) => item.productId && item.quantity > 0);

    if (normalizedItems.length === 0) {
        throw new ApiError(400, "At least one valid item is required");
    }

    const products = await Product.find({
        _id: { $in: normalizedItems.map((item) => item.productId) },
        vendor: vendorId,
    }).select("_id price stock");

    if (products.length !== normalizedItems.length) {
        throw new ApiError(400, "Some items do not belong to this vendor");
    }

    const orderItems = normalizedItems.map((item) => {
        const product = products.find((entry) => String(entry._id) === String(item.productId));

        if (!product || Number(product.stock || 0) < item.quantity) {
            throw new ApiError(400, "Some items are out of stock");
        }

        return {
            productId: item.productId,
            quantity: item.quantity,
            price: Number(product.price || 0),
        };
    });

    const totalAmount = orderItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
    );

    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const order = await Order.create({
        orderId,
        vendor: vendorId,
        customerId: customerId || null,
        customerName,
        customerEmail: customerEmail || "",
        items: orderItems,
        totalAmount,
        paymentMethod: paymentMethod || "Cash on Delivery",
        paymentStatus: "Unpaid",
    });

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const isInternalRequest = req.headers["x-api-key"] && req.headers["x-api-key"] === process.env.INTERNAL_API_KEY;

    const orderFilter = isInternalRequest ? {} : { vendor: req.user._id };
    const orders = await Order.find(orderFilter).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, vendor: req.user._id });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus, paymentMethod } = req.body;

    const order = await Order.findOneAndUpdate(
        { _id: id, vendor: req.user._id },
        {
            $set: {
                status,
                paymentStatus,
                paymentMethod
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
