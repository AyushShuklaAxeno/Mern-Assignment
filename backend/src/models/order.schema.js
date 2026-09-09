import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtTimeOfPurchase: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false })

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: "Order must contain at least one item"
        }
    },
    shippingAddress: {
        type: addressSchema,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "card", "upi", "netbanking"],
        required: true
    },

    orderStatus: {
        type: String,
        enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
        default: "placed"
    }
}, { timestamps: true })

export const orderModel = mongoose.model("order", orderSchema)