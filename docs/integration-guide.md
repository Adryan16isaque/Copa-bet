# 📡 Guia de Integração — Grupo 5 (Sistema de Apostas)

Branch: `sistema-de-apostas`  
Responsáveis: Lucas, Daniel, Ygor

---

## ⚙️ Setup Rápido

```bash
cd backend
cp .env.example .env
npm install
npm run seed      # cria banco e popula partidas
npm run dev       # inicia servidor em http://localhost:3000
```

---

## 📋 Tabelas do Banco

### `users`
| Coluna     | Tipo     | Descrição                            |
|------------|----------|--------------------------------------|
| id         | INTEGER  | PK auto-incremento                   |
| username   | TEXT     | Único                                |
| email      | TEXT     | Único                                |
| password   | TEXT     | Hash (Grupo 1 implementa)            |
| tickets    | INTEGER  | Padrão: 1                            |
| created_at | DATETIME |                                      |
| updated_at | DATETIME |                                      |

### `matches`
| Coluna          | Tipo     | Descrição                               |
|-----------------|----------|-----------------------------------------|
| id              | INTEGER  | PK                                      |
| team_a          | TEXT     | Sempre "Brasil"                         |
| team_b          | TEXT     | Adversário                              |
| phase           | TEXT     | Fase da competição                      |
| match_date      | DATETIME | Data/hora da partida                    |
| status          | TEXT     | `upcoming` ou `finished`                |
| goals_a_result  | INTEGER  | Gols reais Brasil (Grupo 3 preenche)    |
| goals_b_result  | INTEGER  | Gols reais adversário (Grupo 3 preenche)|

### `bets`
| Coluna      | Tipo     | Descrição                              |
|-------------|----------|----------------------------------------|
| id          | INTEGER  | PK                                     |
| user_id     | INTEGER  | FK → users.id                          |
| match_id    | INTEGER  | FK → matches.id                        |
| goals_team_a| INTEGER  | Palpite: gols Brasil                   |
| goals_team_b| INTEGER  | Palpite: gols adversário               |
| points      | INTEGER  | NULL até Grupo 3 calcular              |
| status      | TEXT     | `pending` ou `scored`                  |
| created_at  | DATETIME |                                        |

---

## 🔗 Endpoints da API

### Públicos (frontend)
```
GET  /api/matches                  → Partidas disponíveis (upcoming)
POST /api/bets                     → Criar aposta
GET  /api/bets/history?userId=1    → Histórico do usuário
GET  /api/users/1/tickets          → Tickets disponíveis
GET  /api/health                   → Status da API
```

### Integração entre grupos
```
GET  /api/integration/bets                    → Todas as apostas (Grupo 3/4)
GET  /api/integration/matches                 → Todas as partidas com resultados
POST /api/integration/matches/:id/result      → Registra resultado + pontua (Grupo 3)
```

---

## 👥 Por Grupo

### Grupo 1 — Cadastro e Login
1. Substitua o `authMockMiddleware.js` pelo seu middleware JWT/session
2. Popule `req.user = { id, username, email }` no middleware
3. Os controllers já usam `req.user.id` — sem outras mudanças
4. Remova `TEST_USER_ID` do `.env` e do `env.js`
5. O campo `password` na tabela `users` está pronto para hash (bcrypt)

### Grupo 3 — Pontuação
1. Use `GET /api/integration/bets` para listar todas as apostas
2. Use `POST /api/integration/matches/:id/result` com body `{ goalsA, goalsB }` para:
   - Registrar o resultado real da partida
   - Calcular e salvar pontos automaticamente em todas as apostas
3. Regras já implementadas em `src/services/pointsService.js`:
   - **10 pts** → placar exato
   - **7 pts** → vencedor OU empate OU saldo de gols correto
   - **0 pts** → errou

### Grupo 4 — Ranking
1. Use `GET /api/integration/bets` para obter apostas com pontos
2. Agrupe por `user_id` e some `points` para calcular o ranking
3. A resposta já inclui `username` e `points` por aposta

### Grupo 2 — Dashboard e Interface
1. O frontend oficial está em `interface/` (servido pelo backend em http://localhost:3000)
2. A API base está em `interface/js/api.js` (usa `/api` na mesma origem)
3. O estado global está em `window.APP_STATE`
4. A pasta `frontend/` é a UI antiga do Grupo 5 — mantida só como referência

---

## 📝 Padrão de Resposta JSON

```json
// Sucesso
{ "success": true, "message": "...", "data": {} }

// Erro
{ "success": false, "message": "...", "error": "..." }
```

---

## 🔄 Reset do Banco

```bash
npm run db:reset   # apaga tudo e recria
npm run seed       # só popula (não apaga)
```
