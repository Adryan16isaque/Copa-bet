/**
 * Schema do banco de dados.
 * Cria todas as tabelas necessárias para o Grupo 5 (Sistema de Apostas).
 *
 * Compatível com os demais grupos:
 * - Grupo 1: A tabela `users` está preparada para receber campos de autenticação
 * - Grupo 3: A tabela `bets` tem campo `points` para pontuação
 * - Grupo 4: O Grupo 4 pode fazer JOIN em users + bets para ranking
 */

const { getDb } = require('../config/database');

function createSchema() {
  const db = getDb();

  db.exec(`
    -- ============================================================
    -- TABELA: users
    -- Compatível com Grupo 1 (Cadastro e Login).
    -- O Grupo 1 irá adicionar hash de senha e lógica de sessão.
    -- O campo 'tickets' é gerenciado pelo Grupo 5 (apostas).
    -- GRUPO 4: Use esta tabela para JOIN com bets no ranking.
    -- ============================================================
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER  PRIMARY KEY AUTOINCREMENT,
      username    TEXT     UNIQUE NOT NULL,
      email       TEXT     UNIQUE NOT NULL,
      password    TEXT     NOT NULL DEFAULT 'placeholder',
      tickets     INTEGER  NOT NULL DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ============================================================
    -- TABELA: matches
    -- Partidas do Brasil na Copa 2026.
    -- Populada via seed (dados fixos).
    -- GRUPO 3: Use 'status' para saber se a partida foi finalizada.
    -- GRUPO 3: Adicione 'goals_team_a_result' e 'goals_team_b_result'
    --          ao atualizar o resultado real da partida.
    -- ============================================================
    CREATE TABLE IF NOT EXISTS matches (
      id               INTEGER  PRIMARY KEY AUTOINCREMENT,
      team_a           TEXT     NOT NULL,
      team_b           TEXT     NOT NULL,
      phase            TEXT     NOT NULL,
      match_date       DATETIME NOT NULL,
      status           TEXT     NOT NULL DEFAULT 'upcoming',
      goals_a_result   INTEGER  DEFAULT NULL,
      goals_b_result   INTEGER  DEFAULT NULL,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ============================================================
    -- TABELA: bets
    -- Registro de todas as apostas dos usuários.
    -- UNIQUE(user_id, match_id) impede apostas duplicadas no banco.
    -- GRUPO 3: Preencha 'points' ao calcular a pontuação.
    -- GRUPO 3: Use GET /api/integration/bets para buscar todas as apostas.
    -- GRUPO 4: Use esta tabela + users para calcular ranking.
    -- ============================================================
    CREATE TABLE IF NOT EXISTS bets (
      id            INTEGER  PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER  NOT NULL,
      match_id      INTEGER  NOT NULL,
      goals_team_a  INTEGER  NOT NULL,
      goals_team_b  INTEGER  NOT NULL,
      points        INTEGER  DEFAULT NULL,
      status        TEXT     NOT NULL DEFAULT 'pending',
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
      FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
      UNIQUE(user_id, match_id)
    );

    -- Índices para performance nas queries mais comuns
    CREATE INDEX IF NOT EXISTS idx_bets_user_id    ON bets(user_id);
    CREATE INDEX IF NOT EXISTS idx_bets_match_id   ON bets(match_id);
    CREATE INDEX IF NOT EXISTS idx_matches_status  ON matches(status);
  `);

  console.log('✅ Schema criado com sucesso.');
}

module.exports = { createSchema };
