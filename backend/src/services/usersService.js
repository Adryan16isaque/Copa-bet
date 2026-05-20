const db = require('../config/database');

const usersService = {
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, username, email, tickets FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },

    updateTickets: (userId, tickets) => {
        return new Promise((resolve, reject) => {
            db.run('UPDATE users SET tickets = ? WHERE id = ?', [tickets, userId], function(err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }
};

module.exports = usersService;
