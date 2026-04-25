import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const buildRevenueTimeline = (orders, days = 7) => {
    const today = new Date();
    const buckets = [];

    for (let index = days - 1; index >= 0; index -= 1) {
        const bucketDate = new Date(today);
        bucketDate.setHours(0, 0, 0, 0);
        bucketDate.setDate(today.getDate() - index);

        buckets.push({
            key: bucketDate.toISOString().slice(0, 10),
            label: bucketDate.toLocaleDateString("en-IN", { weekday: "short" }),
            fullLabel: bucketDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            }),
            amount: 0,
        });
    }

    const revenueByDay = new Map(buckets.map((item) => [item.key, item]));

    orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        const key = orderDate.toISOString().slice(0, 10);
        const bucket = revenueByDay.get(key);

        if (bucket) {
            bucket.amount += Number(order.totalAmount || 0);
        }
    });

    return buckets;
};

const buildRevenueSummary = (timeline, totalRevenue) => {
    const peakPoint = timeline.reduce(
        (currentPeak, item) => (item.amount > currentPeak.amount ? item : currentPeak),
        timeline[0] || { label: "N/A", amount: 0 },
    );

    return {
        totalRevenue,
        averageDailyRevenue: timeline.length ? totalRevenue / timeline.length : 0,
        latestDayRevenue: timeline[timeline.length - 1]?.amount || 0,
        peakRevenueDay: peakPoint.fullLabel || peakPoint.label || "N/A",
        peakRevenueAmount: peakPoint.amount || 0,
    };
};

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
    const revenueOrders = orders.filter((order) => order.status !== "Cancelled");
    const totalRevenue = revenueOrders
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const lowStockCount = vendorProducts.filter((product) => Number(product.stock || 0) < 20).length;
    const recentOrders = orders.slice(0, 5);
    const revenueTimeline = buildRevenueTimeline(revenueOrders);
    const revenueSummary = buildRevenueSummary(revenueTimeline, totalRevenue);

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
                recentOrders,
                revenueTimeline,
                revenueSummary,
            },
            "Dashboard stats fetched successfully"
        )
    )
})

export {
    getDashboardStats
}
