import { cartModel } from "../../models/cart.schema.js";
import { productModel } from "../../models/product.schema.js";
import { orderModel } from "../../models/order.schema.js";
import { errorResponse, successResponse } from "../../utility/apiResponse.js";

const paymentMethods = ["cod", "card", "upi", "netbanking"];
const validStatuses = ["placed", "processing", "shipped", "delivered", "cancelled"];

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return errorResponse(res, 401, "Not authenticated");

        const { shippingAddress, paymentMethod } = req.body ?? {};

        const { street, city, state, country, zip } = shippingAddress ?? {};

        if (!street?.trim() || !city?.trim() || !state?.trim() || !country?.trim() || !zip?.trim()) {
            return errorResponse(res, 400, "Complete shipping address is required");
        }
        if (!paymentMethods.includes(paymentMethod)) {
            return errorResponse(res, 400, "A valid payment method is required");
        }

        const cart = await cartModel.findOne({ user: userId }).populate("items.product");
        console.log(cart)
        if (!cart || cart.items.length === 0) {
            return errorResponse(res, 400, "Your cart is empty");
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const { product, size, quantity } of cart.items) {
            const variant = product?.variants.find(v => v.size.toLowerCase() === size.toLowerCase());

            if (!product || product.status !== "active" || !variant || variant.quantity < quantity) {
                
                return errorResponse(res, 400, `"${product?.name || "Item"}" (${size}) is unavailable in requested quantity`);
            }

            const effectivePrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price)
                ? product.discountPrice
                : product.price;

            totalAmount += effectivePrice * quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                size,
                quantity,
                priceAtTimeOfPurchase: effectivePrice
            });

            await productModel.updateOne(
                { _id: product._id, "variants.size": size },
                { $inc: { "variants.$.quantity": -quantity } }
            );
        }

        const order = await orderModel.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentMethod
        });

        cart.items = [];
        await cart.save();

        return successResponse(res, 201, "Order placed successfully", order);

    } catch (error) {
        console.error("Place order error:", error);
        if (error.name === "CastError") return errorResponse(res, 400, "Invalid data provided");
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const fetchAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        if (!orders) {
            return errorResponse(res, 400, "Unable to fetch orders");
        }
        return successResponse(res, 200, "Successfully fetched all orders", orders)
    } catch (error) {

        return errorResponse(res, 500, "Internal Server Error");
    }
}

export const fetchMyOrders = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return errorResponse(res, 401, "Not authenticated");

        const orders = await orderModel
            .find({ user: userId })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return successResponse(res, 200, "Successfully fetched all orders", orders || []);
    } catch (error) {
        console.error("Fetch my orders error:", error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};


export const changeOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { order_status } = req.body ?? {};


        if (!order_status || !validStatuses.includes(order_status)) {
            return errorResponse(res, 400, "A valid order status is required");
        }

        const order = await orderModel.findByIdAndUpdate(
            order_id,
            { orderStatus: order_status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return errorResponse(res, 404, "Order not found");
        }

        return successResponse(res, 200, "Order status updated successfully", order);

    } catch (error) {
        console.error("Change order status error:", error);

        if (error.name === "CastError") {
            return errorResponse(res, 400, "Invalid order ID");
        }

        return errorResponse(res, 500, "Internal Server Error");
    }

}