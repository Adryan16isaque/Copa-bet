const db = require('../config/database');
const usersService = require('./usersService');
const matchesService = require('./matchesService');

const betsService = {
    createBet: async (userId, matchId, goalsTeamA, goalsTeamB) => {
        // 1. Check if user exists and has tickets
        const user = await usersService.getUserById(userId);
        if (!user) throw new Error('User not found');
        if (user.tickets <= 0) throw new Error('No tickets available');

        // 2. Check if match exists and is upcoming
        const match = await matchesService.getMatchById(matchId);
        if (!match) throw new Error('Match not found');
        if (match.status !== 'upcoming') throw new Error('Match is not available for betting');
        
        const matchDate = new Date(match.match_date);
        if (matchDate <= new Date()) throw new Error('Match has already started or ended');

        // 3. Check for duplicate bet
        const existingBet = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM bets WHERE user_id = ? AND match_id = ?', [userId, matchId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        if (existingBet) throw new Error('User already bet on this match');

        // 4. Perform transaction: Save bet and decrement ticket
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                db.run(
                    'INSERT INTO bets (user_id, match_id, goals_team_a, goals_team_b) VALUES (?, ?, ?, ?)',
                    [userId, matchId, goalsTeamA, goalsTeamB],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }

                        const betId = this.lastID;

                        db.run(
                            'UPDATE users SET tickets = tickets - 1 WHERE id = ?',
                            [userId],
                            function(err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return reject(err);
                                }

                                db.run('COMMIT');
                                resolve({ betId, ticketsRemaining: user.tickets - 1 });
                            }
                        );
                    }
                );
            });
        });
    },

    getHistoryByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT b.*, m.team_a, m.team_b, m.match_date, m.status as match_status 
                FROM bets b 
                JOIN matches m ON b.match_id = m.id 
                WHERE b.user_id = ? 
                ORDER BY b.created_at DESC
            `;
            db.all(query, [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },

    getAllBets: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM bets', [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = betsService;
