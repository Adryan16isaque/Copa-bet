const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
    console.log(`[Group 2 - Betting System] Server running on port ${PORT}`);
    console.log(`[Group 2 - Betting System] Accessible via http://localhost:${PORT}`);
});
