/**
 * Seed do banco de dados.
 * Popula as partidas do Brasil e cria usuário de teste.
 *
 * Uso:
 *   npm run seed          → popula sem apagar dados existentes
 *   npm run db:reset      → apaga e recria tudo (--reset)
 *
 * As datas das partidas são geradas dinamicamente (hoje + N dias)
 * para garantir que todas estejam no futuro durante os testes.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { getDb, closeDb }   = require('../config/database');
const { createSchema }     = require('./schema');
const { BRAZIL_MATCHES, INITIAL_TICKETS } = require('../utils/constants');
const { futureDateISO }    = require('../utils/helpers');

const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

function seed() {
  createSchema();
  const db = getDb();

  if (shouldReset) {
    console.log('🗑️  Resetando banco de dados...');
    db.exec(`
      DELETE FROM bets;
      DELETE FROM matches;
      DELETE FROM users;
      DELETE FROM sqlite_sequence WHERE name IN ('bets','matches','users');
    `);
    console.log('✅ Banco resetado.');
  }

  // ────────────────────────────────────────────────────────────
  // USUÁRIO DE TESTE
  // GRUPO 1: Substituir este usuário pelo sistema real de cadastro.
  // Manter id=1 para compatibilidade durante os testes de integração.
  // ────────────────────────────────────────────────────────────
  const existingUser = db.prepare('SELECT id FROM users WHERE id = 1').get();

  if (!existingUser) {
    db.prepare(`
      INSERT INTO users (id, username, email, password, tickets)
      VALUES (?, ?, ?, ?, ?)
    `).run(1, 'torcedor', 'teste@copebet.com', 'placeholder_hash', INITIAL_TICKETS);
    console.log('👤 Usuário de teste criado: torcedor (id=1, tickets=1)');
  } else {
    console.log('👤 Usuário de teste já existe (id=1) — ignorado.');
  }

  // ────────────────────────────────────────────────────────────
  // PARTIDAS DO BRASIL
  // Datas geradas a partir de hoje + N dias para ficarem no futuro.
  // Intervalo de 5 dias entre partidas para simular calendário real.
  // ────────────────────────────────────────────────────────────
  const insertMatch = db.prepare(`
    INSERT OR IGNORE INTO matches (id, team_a, team_b, phase, match_date, status)
    VALUES (?, ?, ?, ?, ?, 'upcoming')
  `);

  const seedMatches = db.transaction(() => {
    BRAZIL_MATCHES.forEach((match, index) => {
      const daysOffset = 30 + index * 5; // hoje + 30 dias, +5 por rodada
      const matchDate = futureDateISO(daysOffset);

      insertMatch.run(
        match.id,
        match.team_a,
        match.team_b,
        match.phase,
        matchDate
      );
    });
  });

  seedMatches();
  console.log(`⚽ ${BRAZIL_MATCHES.length} partidas do Brasil inseridas.`);

  const totalMatches = db.prepare('SELECT COUNT(*) as count FROM matches').get();
  const totalUsers   = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`\n📊 Estado do banco:`);
  console.log(`   Partidas: ${totalMatches.count}`);
  console.log(`   Usuários: ${totalUsers.count}`);
  console.log('\n✅ Seed concluído. Rode "npm run dev" para iniciar o servidor.\n');

  closeDb();
}

seed();
