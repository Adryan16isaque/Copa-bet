/**
 * Prepara o ambiente: .env + pastas + imagens opcionais.
 */
const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(backendDir, '..', '..');
const envPath = path.join(backendDir, '.env');
const envExample = path.join(backendDir, '.env.example');
const frontendImages = path.join(repoRoot, 'interface', 'images');
const legacyImages = path.join(repoRoot, 'sistemaApostas', 'images');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to);
    else if (!fs.existsSync(to)) fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(envPath) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envPath);
  console.log('✅ Arquivo .env criado a partir de .env.example');
} else if (fs.existsSync(envPath)) {
  console.log('ℹ️  .env já existe');
} else {
  console.warn('⚠️  .env.example não encontrado');
}

fs.mkdirSync(frontendImages, { recursive: true });
copyDir(legacyImages, frontendImages);
console.log('✅ Pasta interface/images verificada');
console.log('\nPróximo passo: npm run seed && npm run dev');
