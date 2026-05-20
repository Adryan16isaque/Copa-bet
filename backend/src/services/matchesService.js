const db = require('../config/database');

const matchesService = {
    getAllMatches: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM matches ORDER BY match_date ASC', [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },

    getUpcomingMatches: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM matches WHERE status = 'upcoming' AND match_date > datetime('now') ORDER BY match_date ASC", [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },

    getMatchById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM matches WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }
};

module.exports = matchesService;
