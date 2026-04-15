import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        customerName: {
            type: String,
            required: true
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
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Order", orderSchema)
