const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Group 2 - Betting System] Server running on http://localhost:${PORT}`);
    console.log(`[Group 2 - Betting System] Acceptable origins: *`);
});
