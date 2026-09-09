import { errorResponse, successResponse } from "../../utility/apiResponse.js"
import { userModel } from '../../models/user.schema.js'

export const getUserInfo = async (req, res) => {
    try {
        const userID = req.user._id
        const user = await userModel.findById(userID).select("-password");

        if (!user) {
            return errorResponse(res, 400, "User account didn't find")
        }

        return successResponse(res, 200, "Successfully get the user details", user)
    } catch (error) {
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userID = req.user?._id;
        const { name, phone, address } = req.body ?? {};

        const updateData = {};
        if (name !== undefined) {
            const trimmedName = name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 20) {
                return errorResponse(res, 400, "Name must be between 3 and 20 characters");
            }
            updateData.name = trimmedName;
        }

        if (phone !== undefined) {
            const trimmedPhone = phone.trim();
            if (trimmedPhone && !/^\+?[0-9]{7,15}$/.test(trimmedPhone)) {
                return errorResponse(res, 400, "Please provide a valid phone number");
            }
            updateData.phone = trimmedPhone;
        }

        if (address) {
            updateData.address = {
                street: address.street?.trim() || '',
                city: address.city?.trim() || '',
                state: address.state?.trim() || '',
                country: address.country?.trim() || '',
                zip: address.zip?.trim() || '',
            };
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userID,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return errorResponse(res, 404, "User not found");
        }

        return successResponse(res, 200, "Profile updated successfully", updatedUser);
    } catch (error) {
        console.error("Update profile error:", error);
        return errorResponse(res, 500, error.message || "Internal Server Error");
    }
};

export const updateUserAddress = async (req, res) => {
    try {
        const userID = req.user?._id;
        const { street, city, state, country, zip } = req.body ?? {};

        if (!street?.trim() || !city?.trim() || !state?.trim() || !country?.trim() || !zip?.trim()) {
            return errorResponse(res, 400, "All address fields (street, city, state, country, zip) are required");
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userID,
            {
                address: {
                    street: street.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    country: country.trim(),
                    zip: zip.trim(),
                },
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return errorResponse(res, 404, "User not found");
        }

        return successResponse(res, 200, "Address updated successfully", updatedUser);
    } catch (error) {
        console.error("Update address error:", error);
        return errorResponse(res, 500, error.message || "Internal Server Error");
    }
};