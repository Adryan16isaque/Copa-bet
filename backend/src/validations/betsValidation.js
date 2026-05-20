const betsValidation = {
    validateCreate: (data) => {
        const { userId, matchId, goalsTeamA, goalsTeamB } = data;
        const errors = [];

        if (!userId) errors.push('userId is required');
        if (!matchId) errors.push('matchId is required');
        if (goalsTeamA === undefined || goalsTeamA < 0) errors.push('goalsTeamA must be a non-negative integer');
        if (goalsTeamB === undefined || goalsTeamB < 0) errors.push('goalsTeamB must be a non-negative integer');

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

module.exports = betsValidation;
