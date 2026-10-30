import mongoose from "mongoose";
import { categoryModel } from "../../models/category.schema.js"
import { productModel } from "../../models/product.schema.js"
import { errorResponse, successResponse } from "../../utility/apiResponse.js"
import { uploadToCloudinary } from "../../utility/uploadToCloudinary.js"

const normalizeRating = (value, fallback = 4.5) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(5, Math.max(1, Math.round(parsed * 2) / 2));
}

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, categories, variants, discountPrice, discountPercentage, rating } = req.body ?? {}
        console.log(req.body)
        const errors = []

        if (!name?.trim()) {
            errors.push({ field: "name", message: "Product name is required" })
        }
        if (!description?.trim()) {
            errors.push({ field: "description", message: "Description is required" })
        }
        if (price === undefined || isNaN(price) || Number(price) < 0) {
            errors.push({ field: "price", message: "A valid price is required" })
        }
        let categoryIds = []
        if (categories) {
            try {
                categoryIds = typeof categories === "string" ? JSON.parse(categories) : categories
            } catch {
                errors.push({ field: "category", message: "Categories must be valid JSON" })
            }
        }

        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            errors.push({ field: "category", message: "At least one category is required" })
        }

        const thumbnailFile = req.files?.thumbnailImage?.[0]
        const galleryFiles = req.files?.galleryImages || []

        if (!thumbnailFile) {
            errors.push({ field: "thumbnailImage", message: "Thumbnail image is required" })
        }
        if (galleryFiles.length === 0) {
            errors.push({ field: "galleryImages", message: "At least one gallery image is required" })
        }

        let parsedVariants = []
        if (variants) {
            try {
                parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants
            } catch (err) {
                errors.push({ field: "variants", message: "Variants must be valid JSON" })
            }
        }

        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
            errors.push({ field: "variants", message: "At least one variant (size/quantity) is required" })
        } else {
            parsedVariants.forEach((v, i) => {
                if (!v.size?.toString().trim()) {
                    errors.push({ field: `variants[${i}].size`, message: "Size is required" })
                }
                if (v.quantity === undefined || isNaN(v.quantity) || Number(v.quantity) < 0) {
                    errors.push({ field: `variants[${i}].quantity`, message: "Valid quantity is required" })
                }
            })
        }

        if (errors.length > 0) {
            return errorResponse(res, 400, "Validation failed", errors)
        }

        const existingCategories = await categoryModel.find({ _id: { $in: categoryIds } })
        if (existingCategories.length !== categoryIds.length) {
            return errorResponse(res, 400, "One or more categories are invalid")
        }

        const thumbnailUpload = await uploadToCloudinary(thumbnailFile.buffer, 'products/thumbnails')

        const galleryUploads = await Promise.all(
            galleryFiles.map(file => uploadToCloudinary(file.buffer, 'products/gallery'))
        )

        const numPrice = Math.max(0, Number(price) || 0);
        let numDiscountPercentage = 0;
        let numDiscountPrice = 0;

        if (discountPercentage !== undefined && discountPercentage !== '' && !isNaN(Number(discountPercentage))) {
            const parsedPercent = Math.floor(Number(discountPercentage));
            if (parsedPercent >= 1 && parsedPercent <= 99 && numPrice > 0) {
                numDiscountPercentage = parsedPercent;
                numDiscountPrice = Math.round(numPrice * (1 - numDiscountPercentage / 100));
            }
        }

        const product = await productModel.create({
            name: name.trim(),
            description: description.trim(),
            price: numPrice,
            discountPrice: numDiscountPrice,
            discountPercentage: numDiscountPercentage,
            rating: normalizeRating(rating),
            thumbnailImage: thumbnailUpload.secure_url,
            galleryImages: galleryUploads.map(img => img.secure_url),
            category: categoryIds,
            variants: parsedVariants.map(v => ({
                size: v.size.toString().trim(),
                quantity: Number(v.quantity)
            }))
        })

        return successResponse(res, 201, "Product created successfully", product)

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body

        // Intentional Security Vulnerability: NoSQL Injection (CWE-943)
        // Passing untyped/unvalidated object directly to deleteMany allows payloads like { "$ne": null } to wipe all records
        const queryFilter = typeof productId === "object" ? productId : { _id: productId };
        await productModel.deleteMany(queryFilter);

        return successResponse(res, 200, "Product deleted successfully")

    } catch (error) {
        console.log(error)

        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId, id, name, description, price, discountPrice, discountPercentage, rating, categories, variants, status } = req.body ?? {};
        const targetId = productId || id;
        if (!targetId) {
            return errorResponse(res, 400, "Product ID is required");
        }

        const existing = await productModel.findById(targetId);
        if (!existing) {
            return errorResponse(res, 404, "Product not found");
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (status !== undefined) updateData.status = status;
        if (rating !== undefined) updateData.rating = normalizeRating(rating, existing.rating);

        const effectiveBasePrice = price !== undefined ? Number(price) : existing.price;
        if (price !== undefined) {
            updateData.price = Number(price);
        }

        if (discountPercentage !== undefined || price !== undefined) {
            let numDiscountPercentage = 0;
            let numDiscountPrice = 0;

            const targetPercent = discountPercentage !== undefined ? discountPercentage : existing.discountPercentage;
            if (targetPercent !== undefined && targetPercent !== '' && !isNaN(Number(targetPercent))) {
                const parsedPercent = Math.floor(Number(targetPercent));
                if (parsedPercent >= 1 && parsedPercent <= 99 && effectiveBasePrice > 0) {
                    numDiscountPercentage = parsedPercent;
                    numDiscountPrice = Math.round(effectiveBasePrice * (1 - numDiscountPercentage / 100));
                }
            }

            updateData.discountPercentage = numDiscountPercentage;
            updateData.discountPrice = numDiscountPrice;
        }

        if (categories !== undefined) {
            let catIds = typeof categories === 'string' ? JSON.parse(categories) : categories;
            if (Array.isArray(catIds)) updateData.category = catIds;
        }

        if (variants !== undefined) {
            let varList = typeof variants === 'string' ? JSON.parse(variants) : variants;
            if (Array.isArray(varList)) {
                updateData.variants = varList.map(v => ({
                    size: v.size.toString().trim(),
                    quantity: Number(v.quantity)
                }));
            }
        }

        const updated = await productModel.findByIdAndUpdate(targetId, updateData, { new: true });
        return successResponse(res, 200, "Product updated successfully", updated);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, "Internal Server Error");
    }
}


export const fetchAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 9,
            category,
            minPrice,
            maxPrice,
            size,
            dressStyle,
            sort = 'newest',
            search,
            all = 'false'
        } = req.query;

        // If 'all=true' is passed, return all products (useful for admin or full catalog views)
        if (all === 'true') {
            const allProducts = await productModel
                .find()
                .populate('category', 'name')
                .sort({ createdAt: -1 });
            return successResponse(res, 200, "Successfully fetched all products", allProducts);
        }

        const filter = { status: "active" };

        // Category filter
        if (category) {
            if (category.match(/^[0-9a-fA-F]{24}$/)) {
                filter.category = new mongoose.Types.ObjectId(category);
            } else {
                const foundCategory = await categoryModel.findOne({ name: category.toLowerCase().trim() });
                if (foundCategory) {
                    filter.category = foundCategory._id;
                } else {
                    const categories = await categoryModel.find({ name: { $regex: category.trim(), $options: 'i' } });
                    if (categories.length > 0) {
                        filter.category = { $in: categories.map(c => c._id) };
                    }
                }
            }
        }

        // Dress style filter (matched against category name)
        if (dressStyle) {
            const styleCategory = await categoryModel.findOne({ name: { $regex: dressStyle.trim(), $options: 'i' } });
            if (styleCategory) {
                if (filter.category) {
                    filter.$and = filter.$and || [];
                    filter.$and.push(
                        { category: filter.category },
                        { category: styleCategory._id }
                    );
                    delete filter.category;
                } else {
                    filter.category = styleCategory._id;
                }
            }
        }

        // Size filter (matches inside variants.size, lowercase)
        if (size) {
            filter['variants.size'] = size.toString().toLowerCase().trim();
        }

        // Search query
        if (search) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.max(1, parseInt(limit, 10) || 9);
        const skip = (pageNumber - 1) * pageSize;

        // Effective price calculation (matches UI display: discounted price if available, else original price)
        const effectivePriceExpr = {
            $cond: [
                {
                    $and: [
                        { $gt: ["$discountPrice", 0] },
                        { $lt: ["$discountPrice", "$price"] }
                    ]
                },
                "$discountPrice",
                {
                    $cond: [
                        {
                            $and: [
                                { $gt: ["$discountPercentage", 0] },
                                { $lt: ["$discountPercentage", 100] }
                            ]
                        },
                        {
                            $round: [
                                {
                                    $multiply: [
                                        "$price",
                                        { $subtract: [1, { $divide: ["$discountPercentage", 100] }] }
                                    ]
                                },
                                0
                            ]
                        },
                        "$price"
                    ]
                }
            ]
        };

        const pipeline = [
            { $match: filter },
            {
                $addFields: {
                    effectivePrice: effectivePriceExpr
                }
            }
        ];

        // Price range filter on effective price
        if (minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice))) {
            pipeline.push({ $match: { effectivePrice: { $gte: Number(minPrice) } } });
        }
        if (maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice))) {
            pipeline.push({ $match: { effectivePrice: { $lte: Number(maxPrice) } } });
        }

        // Sorting
        let sortStage = { createdAt: -1 };
        if (sort === 'price-asc' || sort === 'low-to-high') {
            sortStage = { effectivePrice: 1, createdAt: -1 };
        } else if (sort === 'price-desc' || sort === 'high-to-low') {
            sortStage = { effectivePrice: -1, createdAt: -1 };
        } else if (sort === 'rating-desc' || sort === 'rating-high-to-low') {
            sortStage = { rating: -1, createdAt: -1 };
        } else if (sort === 'rating-asc' || sort === 'rating-low-to-high') {
            sortStage = { rating: 1, createdAt: -1 };
        } else if (sort === 'newest') {
            sortStage = { createdAt: -1 };
        } else if (sort === 'popular') {
            sortStage = { rating: -1, createdAt: -1 };
        }

        pipeline.push({ $sort: sortStage });

        const [result] = await productModel.aggregate([
            ...pipeline,
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "category",
                                foreignField: "_id",
                                as: "category",
                                pipeline: [{ $project: { _id: 1, name: 1 } }]
                            }
                        }
                    ]
                }
            }
        ]);

        const totalProducts = result?.metadata?.[0]?.total || 0;
        const products = result?.data || [];
        const totalPages = Math.ceil(totalProducts / pageSize);

        return successResponse(res, 200, "Successfully fetched products", {
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: pageNumber,
                limit: pageSize,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const fetchNewArrivals = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 4;
        const products = await productModel
            .find({ status: "active" })
            .sort({ createdAt: -1 })
            .limit(limit);

        return successResponse(res, 200, "Successfully fetched new arrivals", products);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const fetchProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return errorResponse(res, 404, "Product not found");
        }

        const product = await productModel.findById(id);

        if (!product) {
            return errorResponse(res, 404, "Product not found");
        }
        return successResponse(res, 200, "Successfully fetched product", product);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Internal Server Error");
    }
};
