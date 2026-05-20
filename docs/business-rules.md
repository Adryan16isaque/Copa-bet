# Business Rules - Group 2 (Betting System)

## Tickets
- Each user starts with 1 ticket (defined in `users` table).
- 1 ticket = 1 bet.
- Tickets are consumed upon successful bet creation.
- If tickets = 0, the user cannot place more bets.

## Betting
- Bets consist of score predictions (e.g., 2x1).
- Users can only bet on matches that haven't started yet.
- Only one bet is allowed per match per user.
- Matches are restricted to Brazil's games in the 2026 World Cup.

## Scoring (Integration for Group 3)
- Exact match: 10 points.
- Partial match: 7 points.
- Error: 0 points.
