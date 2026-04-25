import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            index: true
        },
        customerId: {
            type: Schema.Types.ObjectId,
            default: null
        },
        customerName: {
            type: String,
            required: true
        },
        customerEmail: {
            type: String,
            default: ""
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        paymentStatus: {
            type: String,
            enum: ["Paid", "Unpaid", "Refunded"],
            default: "Unpaid"
        },
        paymentMethod: {
            type: String,
            enum: ["Cash on Delivery", "Online"],
            default: "Cash on Delivery"
        },
        cancellation: {
            byRole: {
                type: String,
                enum: ["User", "Vendor", "Admin"],
                default: null
            },
            reason: {
                type: String,
                default: ""
            },
            cancelledAt: {
                type: Date,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Order", orderSchema)
