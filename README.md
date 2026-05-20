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

## 🛠️ Como Executar em uma Máquina Nova

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior recomendada).

### 1. Configuração do Backend (Servidor)
1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz da pasta `backend` (ou copie o exemplo):
   ```bash
   cp .env.example .env
   ```
   *Nota: O arquivo `.env` padrão já vem configurado para usar a porta 3000.*
4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   - O servidor rodará em `http://localhost:3000`.
   - **Banco de Dados**: O banco SQLite (`database.db`) e os dados iniciais (jogos do Brasil) são criados automaticamente na primeira execução.

### 2. Configuração do Frontend (Interface)
1. Não é necessário instalar dependências para o frontend (Vanilla JS).
2. Basta abrir o arquivo `frontend/index.html` no seu navegador de preferência.
3. **Importante**: O frontend espera que o backend esteja rodando em `http://localhost:3000`. Se você alterou a porta no `.env` do backend, atualize a constante `API_URL` em `frontend/services/api.js`.

## ⚠️ Troubleshooting (Solução de Problemas)

- **Erro de Conexão com o Servidor**:
  1. Verifique se o terminal do backend está aberto e sem erros.
  2. Certifique-se de que rodou `npm install` na pasta `backend`.
  3. Verifique se existe o arquivo `.env` na pasta `backend`.
  4. Tente acessar `http://localhost:3000/health` no navegador. Se carregar um JSON com `status: "ok"`, o backend está funcionando.
- **Node_modules não encontrado**: Se você clonou o repositório agora, lembre-se que a pasta `node_modules` não é versionada. Você **precisa** rodar `npm install`.
- **Porta em uso**: Se a porta 3000 estiver ocupada, altere o valor de `PORT` no arquivo `.env` e reinicie o servidor.

---
*Desenvolvido pela equipe do Grupo 2 - Copa Bet 2026.*
