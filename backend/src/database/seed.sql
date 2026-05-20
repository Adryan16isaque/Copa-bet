-- Test User (id=1) for Group 2 testing
INSERT OR IGNORE INTO users (id, username, email, password, tickets) VALUES (1, 'torcedor', 'teste@email.com', '123456', 1);

-- Brazil Matches - World Cup 2026 (Simulated Dates)
-- Using date('now', '+30 days') to ensure they are in the future for testing
INSERT OR IGNORE INTO matches (id, team_a, team_b, match_date, status) VALUES 
(1, 'Brasil', 'França', datetime('now', '+15 days'), 'upcoming'),
(2, 'Brasil', 'Sérvia', datetime('now', '+21 days'), 'upcoming'),
(3, 'Brasil', 'Camarões', datetime('now', '+26 days'), 'upcoming'),
(4, 'Brasil', 'Portugal', datetime('now', '+32 days'), 'upcoming'),
(5, 'Brasil', 'Alemanha', datetime('now', '+36 days'), 'upcoming'),
(6, 'Brasil', 'Argentina', datetime('now', '+40 days'), 'upcoming'),
(7, 'Brasil', 'Espanha', datetime('now', '+44 days'), 'upcoming');
