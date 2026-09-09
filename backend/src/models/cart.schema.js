import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            size: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true })

export const cartModel = mongoose.model('cart', cartSchema)