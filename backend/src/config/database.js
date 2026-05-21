/**
 * Configuração e conexão com o banco de dados SQLite.
 * Utiliza better-sqlite3 (síncrono) para código mais limpo e previsível.
 *
 * Estruturado para facilitar futura migração para PostgreSQL/MySQL:
 * - Toda query SQL fica nos services/models, não espalhada no código
 * - A conexão é um singleton reutilizável
 */

const Database = require('better-sqlite3');
const path = require('path');
const env = require('./env');

const DB_PATH = path.resolve(__dirname, '..', '..', env.DB_PATH.replace('./', ''));

let db = null;

/**
 * Retorna a conexão com o banco (singleton).
 * Cria o arquivo do banco se não existir.
 */
function getDb() {
  if (!db) {
    db = new Database(DB_PATH, {
      verbose: env.isDev() ? console.log : null,
    });

    // Habilita foreign keys (SQLite exige ativação explícita)
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

/**
 * Fecha a conexão com o banco (usado em testes e graceful shutdown).
 */
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
