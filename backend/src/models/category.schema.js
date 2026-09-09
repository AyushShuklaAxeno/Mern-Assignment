import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    }
});

export const categoryModel = mongoose.model("category", categorySchema);
