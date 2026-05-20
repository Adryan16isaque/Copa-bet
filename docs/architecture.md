# Architecture - Group 2 (Betting System)

## Patterns
- **Modular Monolith**: Organized by technical layers (Controllers, Services, Routes) with clear domain boundaries.
- **Service Layer**: Contains all business logic, decoupled from HTTP concerns.
- **RESTful API**: Standardized JSON responses and HTTP status codes.
- **Clean Architecture Principles**: Low coupling between the database and business logic.

## Stack
- **Backend**: Node.js, Express.
- **Database**: SQLite (local, single file).
- **Frontend**: Vanilla HTML/CSS/JS (no frameworks, component-based structure).

## Scalability
- The system is designed to be easily migrated to a more robust database like PostgreSQL.
- Business logic is centralized in services, making it easy to add new features like multiple tickets or advanced betting types.
