# Copa Bet

Sistema de palpites esportivos — interface + API integrados.

## Estrutura do projeto

```
copaBet/
├── interface/                 ← Telas (HTML, CSS, JS) — USE ESTA UI
│   ├── index.html             Login
│   ├── pages/                 Dashboard, jogos, palpites, ranking...
│   ├── css/
│   ├── js/
│   └── images/                Logo e fundos (adicione logo.jpeg aqui)
│
├── sistemaApostas/
│   └── backend/               ← API Node.js + servidor que entrega a interface
│       ├── src/
│       ├── scripts/setup.js
│       └── .env.example
│
├── legado/                    Arquivos antigos (ignorar)
├── docs/                      Documentação da API
├── rodar.bat                  Atalho Windows — duplo clique para subir tudo
└── package.json               Scripts na raiz do repositório
```

## Como rodar (mais fácil — Windows)

**Duplo clique em `rodar.bat`** na pasta do projeto.

Ou no PowerShell, na raiz do projeto:

```powershell
.\rodar.ps1
```

## Como rodar (manual)

Requisito: **Node.js 18 ou superior** ([nodejs.org](https://nodejs.org)).

```bash
# Na raiz copaBet/
npm run setup
npm run seed
npm run dev
```

Abra: **http://localhost:3000**

### Login (modo demonstração)

- E-mail e senha: qualquer valor
- Usuário de teste no banco: `torcedor` (id=1), criado pelo `seed`

## Comandos úteis

| Comando | Onde | Descrição |
|---------|------|-----------|
| `npm run dev` | raiz | Sobe o servidor com reload |
| `npm run seed` | raiz | Cria usuário e partidas no SQLite |
| `npm run db:reset` | raiz | Apaga e recria o banco |

Equivalente dentro de `sistemaApostas/backend/`:

```bash
cd sistemaApostas/backend
npm run dev
```

## Problemas comuns

### Erro do `better-sqlite3` (versão do Node)

```bash
cd sistemaApostas/backend
npm rebuild better-sqlite3
```

Se persistir, reinstale:

```bash
cd sistemaApostas/backend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Página em branco ou API não responde

- Use **http://localhost:3000** — não abra os `.html` direto pelo Explorer (`file://`).
- Confirme que o terminal mostra `Servidor rodando em http://localhost:3000`.

### Imagens do login

Coloque na pasta `interface/images/`:

- `logo.jpeg`
- `background.jpeg` (opcional, usado no CSS)

Se existirem em `sistemaApostas/images/`, rode `npm run setup` para copiar automaticamente.

## API

Documentação: `docs/integration-guide.md`

- `GET /api/matches`
- `POST /api/bets`
- `GET /api/bets/history?userId=1`
- `GET /api/users/:id/tickets`
