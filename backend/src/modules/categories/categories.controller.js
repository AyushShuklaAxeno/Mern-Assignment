import { categoryModel } from "../../models/category.schema.js"
import { productModel } from "../../models/product.schema.js"
import { errorResponse, successResponse } from "../../utility/apiResponse.js"

export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body ?? {}
        const errors = []

        if (!name?.trim()) {
            errors.push({ field: "name", message: "Category name is required" })
        }

        if (description && typeof description !== "string") {
            errors.push({ field: "description", message: "Description must be a string" })
        }

        if (errors.length > 0) {
            return errorResponse(res, 401, "Validation failed", errors)
        }



        const existingCategory = await categoryModel.findOne({ name: name })

        if (existingCategory) {
            return errorResponse(res, 400, "Category with this name already exists")
        }

        const category = await categoryModel.create({
            name: name,
            description: description
        })

        return successResponse(res, 201, "Category created successfully")

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const fetchAllCategories = async (req, res) => {

    try {
        const categories = await categoryModel.find();

        if (!categories) {
            return errorResponse(res, 400, "Unable to fetch categories")
        }

        return successResponse(res, 200, "Successfully fetched all categories", categories)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body ?? {}

        if (!categoryId?.trim()) {
            return errorResponse(res, 400, "Category ID is required")
        }

        const category = await categoryModel.findById(categoryId)

        if (!category) {
            return errorResponse(res, 404, "Category not found")
        }

        const productCount = await productModel.countDocuments({ category: categoryId })

        if (productCount > 0) {
            return errorResponse(res, 400, `Cannot delete category — ${productCount} product(s) are assigned to it`)
        }

        const subCategoryCount = await categoryModel.countDocuments({ parentCategory: categoryId })

        if (subCategoryCount > 0) {
            return errorResponse(res, 400, `Cannot delete category — ${subCategoryCount} subcategory(s) reference it as parent`)
        }

        await categoryModel.findByIdAndDelete(categoryId)

        return successResponse(res, 200, "Category deleted successfully")

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}