const apiResponse = require('../utils/apiResponse');

const validationMiddleware = (validator) => {
    return (req, res, next) => {
        const { isValid, errors } = validator(req.body);
        if (!isValid) {
            return apiResponse.error(res, 'Validation error', errors, 400);
        }
        next();
    };
};

module.exports = validationMiddleware;
