/**
 * Constantes globais do sistema.
 * Centralizar aqui evita "magic numbers" espalhados pelo código.
 */

const MATCH_STATUS = {
  UPCOMING: 'upcoming',
  FINISHED: 'finished',
};

const BET_STATUS = {
  PENDING: 'pending',   // aposta feita, partida ainda não ocorreu
  SCORED: 'scored',     // GRUPO 3: pontuação calculada
};

/**
 * Regras de pontuação — usadas pelo Grupo 3.
 * Definidas aqui para que outros grupos possam importar sem duplicar.
 *
 * GRUPO 3: Importe POINTS_RULES de utils/constants.js para calcular pontos.
 */
const POINTS_RULES = {
  EXACT_SCORE: 10,   // Acerto total: placar exato correto
  PARTIAL: 7,        // Acerto parcial: vencedor OU empate OU saldo de gols correto
  WRONG: 0,          // Resultado errado: não pontua
};

// Partidas do Brasil na Copa 2026
// ATENÇÃO: As datas são dinâmicas (geradas no seed) para facilitar testes.
// Aqui ficam apenas os dados fixos (times, fase).
const BRAZIL_MATCHES = [
  { id: 1, team_a: 'Brasil', team_b: 'França',    phase: 'Grupo G – Rodada 1' },
  { id: 2, team_a: 'Brasil', team_b: 'Sérvia',    phase: 'Grupo G – Rodada 2' },
  { id: 3, team_a: 'Brasil', team_b: 'Camarões',  phase: 'Grupo G – Rodada 3' },
  { id: 4, team_a: 'Brasil', team_b: 'Portugal',  phase: 'Oitavas de Final'   },
  { id: 5, team_a: 'Brasil', team_b: 'Alemanha',  phase: 'Quartas de Final'   },
  { id: 6, team_a: 'Brasil', team_b: 'Argentina', phase: 'Semifinal'          },
  { id: 7, team_a: 'Brasil', team_b: 'Espanha',   phase: 'Final'              },
];

// Número inicial de tickets por usuário
const INITIAL_TICKETS = 1;

module.exports = {
  MATCH_STATUS,
  BET_STATUS,
  POINTS_RULES,
  BRAZIL_MATCHES,
  INITIAL_TICKETS,
};
