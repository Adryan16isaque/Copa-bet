/**
 * Caminhos do monorepo — raiz do repositório Copa Bet.
 */
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(backendDir, '..', '..');
const frontendDir = path.join(repoRoot, 'interface');

module.exports = {
  backendDir,
  repoRoot,
  frontendDir,
};
