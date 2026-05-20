const usersValidation = {
    validateId: (id) => {
        if (!id || isNaN(id)) return false;
        return true;
    }
};

module.exports = usersValidation;
