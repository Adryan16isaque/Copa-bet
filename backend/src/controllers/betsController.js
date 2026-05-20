const betsService = require('../services/betsService');
const betsValidation = require('../validations/betsValidation');
const apiResponse = require('../utils/apiResponse');

const betsController = {
    create: async (req, res, next) => {
        try {
            const validation = betsValidation.validateCreate(req.body);
            if (!validation.isValid) {
                return apiResponse.error(res, 'Validation error', validation.errors, 400);
            }

            const { userId, matchId, goalsTeamA, goalsTeamB } = req.body;
            const result = await betsService.createBet(userId, matchId, parseInt(goalsTeamA), parseInt(goalsTeamB));
            return apiResponse.success(res, 'Bet placed successfully. Ticket consumed.', result, 201);
        } catch (error) {
            next(error);
        }
    },

    getHistory: async (req, res, next) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return apiResponse.error(res, 'UserId is required', {}, 400);
            }

            const history = await betsService.getHistoryByUserId(userId);
            return apiResponse.success(res, 'History retrieved successfully', history);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (req, res, next) => {
        try {
            const bets = await betsService.getAllBets();
            return apiResponse.success(res, 'All bets retrieved successfully (Integration)', bets);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = betsController;
