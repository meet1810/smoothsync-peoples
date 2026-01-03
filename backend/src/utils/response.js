exports.success = (res, message, data = {}) => {
    return res.status(200).json({
        statusCode: 200,
        status: "success",
        message,
        data,
    });
};

exports.error = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
        statusCode,
        status: "error",
        message,
        data: null,
    });
};
