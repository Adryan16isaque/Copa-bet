const authMockMiddleware = (req, res, next) => {
    // Simulating authentication for Group 1
    // For now, we manually set userId to 1 if not provided
    req.user = { id: 1, username: 'torcedor' };
    console.log(`[AuthMock] Authenticated as user ID: ${req.user.id}`);
    next();
};

module.exports = authMockMiddleware;
