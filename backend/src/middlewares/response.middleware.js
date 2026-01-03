const response = require("../utils/response");

module.exports = (req, res, next) => {
    res.success = (msg, data) => response.success(res, msg, data);
    res.error = (msg, status) => response.error(res, msg, status);
    next();
};
