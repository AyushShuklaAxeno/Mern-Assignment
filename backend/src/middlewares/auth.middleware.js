import jwt from 'jsonwebtoken'
import { errorResponse } from '../utility/apiResponse.js'

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        

        if (!token) {
            return errorResponse(res, 401, "Not authenticated, please log in")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            _id: decoded._id,
            role: decoded.role
        }

        next()

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return errorResponse(res, 401, "Session expired, please log in again")
        }
        if (error.name === "JsonWebTokenError") {
            return errorResponse(res, 401, "Invalid token")
        }
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}