import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true,

    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    zip: {
        type: String,
        trim: true,
    }
}, { _id: false })

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']

    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\+?[0-9]{7,15}$/, 'Please provide a valid phone number']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not a valid role'
        },
        default: 'user'
    },
    address: addressSchema
}, { timestamps: true })

export const userModel = mongoose.model('user', userSchema)