const usersService = require('../services/usersService');
const usersValidation = require('../validations/usersValidation');
const apiResponse = require('../utils/apiResponse');

const usersController = {
    getTickets: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!usersValidation.validateId(id)) {
                return apiResponse.error(res, 'Invalid user ID', {}, 400);
            }
            const user = await usersService.getUserById(id);
            if (!user) return apiResponse.error(res, 'User not found', {}, 404);
            
            return apiResponse.success(res, 'Tickets retrieved successfully', { tickets: user.tickets });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = usersController;
