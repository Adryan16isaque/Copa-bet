# Integration Guide - Group 2 (Betting System)

## For Group 1 (Authentication)
- Replace the hardcoded `userId` in frontend calls with the ID of the authenticated user.
- Ensure the `users` table matches the structure required for login.

## For Group 3 (Scoring)
- Use `GET /api/bets/all` to retrieve all bets.
- Update the `points` column in the `bets` table based on the match results (`score_a`, `score_b` in `matches` table).
- Points logic:
    - Exact match: 10 points.
    - Partial match (winner/draw/goal difference): 7 points.
    - Error: 0 points.

## For Group 4 (Ranking)
- Query the `bets` table and sum `points` grouped by `user_id`.

## For Group 5 (Dashboard)
- Use the provided API endpoints to display match cards and user history.
