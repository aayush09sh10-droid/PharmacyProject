import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "./src/models/order.model.js";
import { Product } from "./src/models/product.model.js";
import { DB_NAME } from "./src/constants.js";

dotenv.config({ path: "./.env" });

const seedOrders = [
    {
        orderId: "ORD-1001",
        customerName: "John Doe",
        items: [{ price: 10, quantity: 2 }],
        totalAmount: 20,
        status: "Pending",
        paymentStatus: "Unpaid"
    },
    {
        orderId: "ORD-1002",
        customerName: "Jane Smith",
        items: [{ price: 50, quantity: 1 }],
        totalAmount: 50,
        status: "Delivered",
        paymentStatus: "Paid"
    },
    {
        orderId: "ORD-1003",
        customerName: "Robert Brown",
        items: [{ price: 15, quantity: 3 }],
        totalAmount: 45,
        status: "Processing",
        paymentStatus: "Paid"
    }
];

const seedProducts = [
    {
        name: 'Azithromycin 250mg',
        rxRequired: true,
        category: 'Antibiotic',
        stock: 45,
        expiry: '2025-12-31',
        price: 15.99,
        description: 'Commonly used to treat infections.'
    },
    {
        name: 'Ibuprofen 200mg',
        rxRequired: false,
        category: 'Pain Relief',
        stock: 120,
        expiry: '2026-06-30',
        price: 11.99,
        description: 'NSAID used for pain relief.'
    },
    {
        name: 'Aspirin 100mg',
        rxRequired: false,
        category: 'Pain Relief',
        stock: 89,
        expiry: '2025-09-15',
        price: 7.99,
        description: 'Used for heart health and pain.'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
        console.log("Connected to MongoDB for seeding");
        
        await Order.deleteMany({});
        await Order.insertMany(seedOrders);
        console.log("Orders seeded successfully");

        await Product.deleteMany({});
        await Product.insertMany(seedProducts);
        console.log("Products seeded successfully");
        
        process.exit(0);
    } catch (error) {
        console.log("Seeding failed: ", error);
        process.exit(1);
    }
};

seedDB();
