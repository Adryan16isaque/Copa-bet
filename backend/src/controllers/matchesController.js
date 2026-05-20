const matchesService = require('../services/matchesService');
const apiResponse = require('../utils/apiResponse');

const matchesController = {
    getUpcoming: async (req, res, next) => {
        try {
            const matches = await matchesService.getUpcomingMatches();
            return apiResponse.success(res, 'Upcoming matches retrieved successfully', matches);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (req, res, next) => {
        try {
            const matches = await matchesService.getAllMatches();
            return apiResponse.success(res, 'All matches retrieved successfully', matches);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = matchesController;
