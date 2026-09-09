import { cartModel } from "../../models/cart.schema.js";
import { productModel } from "../../models/product.schema.js";
import { errorResponse, successResponse } from "../../utility/apiResponse.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product_id, size, quantity } = req.body ?? {};

        if (!product_id || !size) {
            return errorResponse(res, 400, "Product and size are required");
        }

        const parsedQuantity = quantity !== undefined ? Number(quantity) : 1;
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return errorResponse(res, 400, "Quantity must be a valid number of at least 1");
        }

        const productDoc = await productModel.findById(product_id);

        if (!productDoc || productDoc.status !== "active") {
            return errorResponse(res, 404, "Product not found");
        }

        const variant = productDoc.variants.find(
            v => v.size?.toLowerCase() === size?.toLowerCase()
        );

        if (!variant) {
            return errorResponse(res, 400, `Size "${size}" is not available for this product`);
        }

        if (variant.quantity <= 0) {
            return errorResponse(res, 400, `Size "${size}" is out of stock`);
        }

        if (variant.quantity < parsedQuantity) {
            return errorResponse(res, 400, `Only ${variant.quantity} item(s) available in stock for size "${size}"`);
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                items: [
                    {
                        product: product_id,
                        size: variant.size,
                        quantity: parsedQuantity
                    }
                ]
            });

            return successResponse(res, 201, "Product added to cart", cart);
        }

        const existingItem = cart.items.find((item) => {
            return (
                item.product?.toString() === product_id &&
                item.size?.toLowerCase() === size?.toLowerCase()
            );
        });

        if (existingItem) {
            if (existingItem.quantity + parsedQuantity > variant.quantity) {
                return errorResponse(
                    res,
                    400,
                    `Cannot add more. Only ${variant.quantity} item(s) available in stock for size "${size}".`
                );
            }
            existingItem.quantity += parsedQuantity;
        } else {
            cart.items.push({
                product: product_id,
                size: variant.size,
                quantity: parsedQuantity
            });
        }

        await cart.save();

        return successResponse(res, 200, "Product added to cart", cart);

    } catch (error) {
        console.error("addToCart error:", error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const increaseCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { itemId } = req.params;
        const size = req.body?.size || req.query?.size;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return errorResponse(res, 404, "Cart not found");
        }

        const item = cart.items.find((item) => {
            const matchesId = item.product.toString() === itemId.toString() || item._id.toString() === itemId.toString();
            if (size) {
                return matchesId && item.size?.toLowerCase() === size.toString().toLowerCase();
            }
            return matchesId;
        });

        if (!item) {
            return errorResponse(res, 404, "Item not found in cart");
        }

        const productDoc = await productModel.findById(item.product);
        const variant = productDoc?.variants.find(v => v.size?.toLowerCase() === item.size?.toLowerCase());

        if (!variant || variant.quantity <= item.quantity) {
            return errorResponse(
                res,
                400,
                `Cannot increase quantity. Only ${variant?.quantity || 0} item(s) available in stock.`
            );
        }

        item.quantity += 1;
        await cart.save();

        return successResponse(res, 200, "Quantity increased", cart);

    } catch (error) {
        console.error("increaseCartItemQuantity error:", error);

        if (error.name === "CastError") {
            return errorResponse(res, 400, "Invalid item ID");
        }

        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const decreaseCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { itemId } = req.params;
        const size = req.body?.size || req.query?.size;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return errorResponse(res, 404, "Cart not found");
        }

        const itemIndex = cart.items.findIndex((item) => {
            const matchesId = item.product.toString() === itemId.toString() || item._id.toString() === itemId.toString();
            if (size) {
                return matchesId && item.size?.toLowerCase() === size.toString().toLowerCase();
            }
            return matchesId;
        });

        if (itemIndex === -1) {
            return errorResponse(res, 404, "Item not found in cart");
        }

        const item = cart.items[itemIndex];

        if (item.quantity <= 1) {
            cart.items.splice(itemIndex, 1);
        } else {
            item.quantity -= 1;
        }

        await cart.save();

        return successResponse(res, 200, "Quantity decreased", cart);

    } catch (error) {
        console.error("decreaseCartItemQuantity error:", error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { itemId } = req.params;
        const size = req.body?.size || req.query?.size;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return errorResponse(res, 404, "Cart not found");
        }

        const itemIndex = cart.items.findIndex((item) => {
            const matchesId = item.product.toString() === itemId.toString() || item._id.toString() === itemId.toString();
            if (size) {
                return matchesId && item.size?.toLowerCase() === size.toString().toLowerCase();
            }
            return matchesId;
        });

        if (itemIndex === -1) {
            return errorResponse(res, 404, "Item not found in cart");
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        return successResponse(res, 200, "Item removed from cart", cart);

    } catch (error) {
        console.error("removeFromCart error:", error);

        if (error.name === "CastError") {
            return errorResponse(res, 400, "Invalid item ID");
        }

        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const fetchCart = async (req, res) => {
    try {
        const userId = req.user?._id;

        const cart = await cartModel.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return successResponse(res, 200, "Successfully fetched cart", { user: userId, items: [] });
        }

        return successResponse(res, 200, "Successfully fetched cart", cart);

    } catch (error) {
        console.error("fetchCart error:", error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user?._id;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return errorResponse(res, 400, "Cart not found");
        }

        cart.items = [];
        await cart.save();

        return successResponse(res, 200, "Cart cleared successfully");

    } catch (error) {
        console.error("clearCart error:", error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};