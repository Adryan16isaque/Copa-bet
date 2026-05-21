<<<<<<< HEAD:README.md
# Copa-bet
=======
# 🏆 Copa Bet 2026 — Sistema de Apostas

**Branch:** `sistema-de-apostas`  
**Grupo 2** Adryan, Lorran e Victor
**Stack:** Node.js · Express · SQLite (better-sqlite3) · Vanilla JS

---

## 🚀 Instalação e Execução

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Instalar dependências
npm install

# 4. Popular banco de dados (cria tabelas + 7 partidas + usuário teste)
npm run seed

# 5. Iniciar servidor (desenvolvimento com hot reload)
npm run dev
# Servidor rodando em: http://localhost:3000
```

### Frontend
Abra `frontend/index.html` diretamente no navegador  
*(ou use a extensão Live Server no VS Code)*

---

## 📂 Estrutura

```
sistema-de-apostas/
├── backend/
│   ├── src/
│   │   ├── config/       → database.js, env.js
│   │   ├── controllers/  → bets, matches, users
│   │   ├── routes/       → REST endpoints + integração
│   │   ├── services/     → regras de negócio
│   │   ├── middlewares/  → erro, validação, auth mock
│   │   ├── validations/  → validações centralizadas
│   │   ├── utils/        → apiResponse, constants, helpers
│   │   └── database/     → schema.js, seed.js
│   └── package.json
├── frontend/
│   ├── assets/css/       → style.css (tema Copa)
│   ├── assets/js/        → api.js, matches.js, history.js, app.js
│   └── index.html
├── docs/
│   ├── integration-guide.md
│   └── business-rules.md
└── README.md
```

---

## 🔗 Endpoints

| Método | Rota                              | Descrição                         |
|--------|-----------------------------------|-----------------------------------|
| GET    | `/api/health`                     | Status da API                     |
| GET    | `/api/matches`                    | Partidas disponíveis              |
| POST   | `/api/bets`                       | Criar aposta                      |
| GET    | `/api/bets/history?userId=1`      | Histórico do usuário              |
| GET    | `/api/users/1/tickets`            | Tickets disponíveis               |
| GET    | `/api/integration/bets`           | Todas apostas (Grupos 3/4)        |
| GET    | `/api/integration/matches`        | Todas partidas (Grupo 3)          |
| POST   | `/api/integration/matches/:id/result` | Registra resultado (Grupo 3) |

---

## 🔄 Resetar banco

```bash
npm run db:reset   # apaga tudo e recria do zero
```

---

## 🤝 Integração com outros grupos

Veja `docs/integration-guide.md` para instruções detalhadas por grupo.
>>>>>>> 76fd7c96f7b3465a1da0e1ad6ff2a611fce56c5e:MODO-DE-USO.md
