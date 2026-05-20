# Copa Bet - Grupo 2 (Sistema de Apostas)

Este módulo é responsável pelo gerenciamento de apostas, tickets e histórico de palpites para a plataforma Copa Bet. Foi desenvolvido com foco em **modularidade**, **baixo acoplamento** e **facilidade de merge** entre as equipes.

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js, Express, SQLite3.
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla).
- **Arquitetura**: Clean Architecture Simplificada (Services, Controllers, Validations).

## 📁 Estrutura do Projeto

```text
/
├── backend/          # API REST e lógica de banco de dados
├── frontend/         # Interface do usuário (SPA sem frameworks)
├── docs/             # Documentação detalhada para integração entre grupos
└── .gitignore        # Configurações para versionamento limpo
```

## 🛠️ Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 14 ou superior).

### 1. Backend (Servidor)
1. Navegue até a pasta: `cd backend`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm start` (ou `npm run dev` para desenvolvimento com nodemon).
   - **Nota**: O banco de dados SQLite (`database.db`) será criado e populado automaticamente na primeira execução com os jogos do Brasil na Copa 2026.

### 2. Frontend (Interface)
1. Basta abrir o arquivo `frontend/index.html` em qualquer navegador moderno.
2. Certifique-se de que o backend está rodando no endereço `http://localhost:3000`.

## ⚽ Funcionalidades do Grupo 2
- **Listagem de Partidas**: Exibição automática dos jogos do Brasil (pré-cadastrados).
- **Sistema de Apostas**: Permite realizar palpites de placar exato.
- **Gestão de Tickets**: Controle de consumo de tickets (usuário inicia com 1 ticket).
- **Validações de Negócio**:
  - Impede apostas duplicadas no mesmo jogo.
  - Impede apostas em jogos que já passaram da data/hora.
  - Valida saldo de tickets do usuário.
- **Histórico**: Visualização de todos os palpites realizados pelo usuário.

## 🔗 Integração com outros Grupos
Este módulo foi preparado para ser facilmente integrado:
- **Grupo 1 (Auth)**: O backend utiliza um `authMockMiddleware`. Substitua pela sua lógica de JWT/Sessão.
- **Grupo 3 (Pontuação)**: O campo `points` na tabela `bets` e o endpoint `GET /api/bets/all` estão prontos para seu uso.
- **Grupo 4 (Ranking)**: Dados centralizados na tabela `bets` para facilitar a agregação de pontos.

Para mais detalhes, consulte `docs/integration-guide.md`.

## ⚠️ Troubleshooting (Solução de Problemas)
- **Erro de Conexão**: Verifique se a porta `3000` está livre. O backend roda em `0.0.0.0:3000` para garantir acessibilidade.
- **CORS**: O servidor está configurado para aceitar requisições de qualquer origem (`*`), facilitando o desenvolvimento local.
- **Banco de Dados**: Se precisar resetar os dados, basta deletar o arquivo `backend/src/database/database.db` e reiniciar o servidor.

---
*Desenvolvido pela equipe do Grupo 2 - Copa Bet 2026.*
