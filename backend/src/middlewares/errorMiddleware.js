const apiResponse = require('../utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    return apiResponse.error(res, message, { detail: err.message }, status);
};

module.exports = errorMiddleware;
