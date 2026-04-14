import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Basic Stats
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    
    // 2. Revenue Aggregation
    const revenueAggregation = await Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 3. Low Stock Alerts (Stock < 20)
    const lowStockProducts = await Product.find({ stock: { $lt: 20 } }).limit(5);
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 20 } });

    // 4. Recent Orders (Latest 5)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                lowStockCount,
                lowStockProducts,
                recentOrders
            },
            "Dashboard stats fetched successfully"
        )
    )
})

export {
    getDashboardStats
}
