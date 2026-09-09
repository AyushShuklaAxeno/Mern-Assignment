
export const successResponse = (
    res,
    statusCode,
    message,
    data = null,
) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, statusCode, message, errors = []) => {

    const response = {
        success: false,
        message,
    };

    if (errors.length > 0) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

