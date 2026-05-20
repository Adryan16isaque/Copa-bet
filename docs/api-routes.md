# API Routes - Group 2 (Betting System)

## Matches
- `GET /api/matches`: Returns upcoming matches available for betting.
- `GET /api/matches/all`: Returns all matches in the database.

## Bets
- `POST /api/bets`: Create a new bet.
    - Body: `{ userId, matchId, goalsTeamA, goalsTeamB }`
    - Returns: Success message and remaining tickets.
- `GET /api/bets/history?userId=1`: Returns bet history for a specific user.
- `GET /api/bets/all`: Integration endpoint for Group 3 to fetch all bets for scoring.

## Users
- `GET /api/users/:id/tickets`: Returns the current ticket count for a user.
