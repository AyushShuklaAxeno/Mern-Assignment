import { errorResponse } from "../utility/apiResponse.js";

export const roleMiddleware = (...roles) => {

  return (req, res, next) => {
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return errorResponse(res, 403, { message: "Access Denied" })
    }

    next();
  };
};
