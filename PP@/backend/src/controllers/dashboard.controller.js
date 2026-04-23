import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    const isInternalRequest = req.headers["x-api-key"] && req.headers["x-api-key"] === process.env.INTERNAL_API_KEY;
    const vendorFilter = isInternalRequest ? {} : { vendor: req.user._id };

    const orderFilter = isInternalRequest ? {} : { vendor: req.user._id };

    const [orders, lowStockProducts] = await Promise.all([
        Order.find(orderFilter).sort({ createdAt: -1 }),
        Product.find({
            ...vendorFilter,
            stock: { $lt: 20 },
        }).sort({ stock: 1 }).limit(5),
    ]);

    const vendorProducts = await Product.find(vendorFilter).select("_id name category stock").sort({ name: 1 });
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "Pending").length;
    const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
    const totalRevenue = orders
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const lowStockCount = vendorProducts.filter((product) => Number(product.stock || 0) < 20).length;
    const recentOrders = orders.slice(0, 5);

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
