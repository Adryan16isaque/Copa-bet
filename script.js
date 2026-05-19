let jogadores = [
  { nome: "Eu", pontos: 20, acertos: 8 },
  { nome: "Outra pessoa", pontos: 10, acertos: 4 },
  { nome: "João", pontos: 15, acertos: 6 },
  { nome: "Maria", pontos: 25, acertos: 10 },
  { nome: "Carlos", pontos: 18, acertos: 7 }
];

// ----------------------
// Ranking geral
// ----------------------
let ranking = [...jogadores].sort((a, b) => b.pontos - a.pontos);

const rankingDiv = document.getElementById("rankingGeral");

ranking.forEach((j, i) => {
  let div = document.createElement("div");
  div.classList.add("item");
  div.innerHTML = `
    <span>${i + 1}º ${j.nome}</span>
    <span>${j.pontos} pts</span>
  `;
  rankingDiv.appendChild(div);
});

// ----------------------
// Top 3 acertos
// ----------------------
let top3 = [...jogadores]
  .sort((a, b) => b.acertos - a.acertos)
  .slice(0, 3);

const top3Div = document.getElementById("top3");

top3.forEach((j, i) => {
  let div = document.createElement("div");
  div.classList.add("item");
  div.innerHTML = `
    <span>${i + 1}º ${j.nome}</span>
    <span>${j.acertos} acertos</span>
  `;
  top3Div.appendChild(div);
});

// ----------------------
// Gráfico TODOS (pontos)
// ----------------------
const graficoTodos = document.getElementById("graficoTodos");
let maxPontos = Math.max(...jogadores.map(j => j.pontos));

ranking.forEach(j => {
  let bar = document.createElement("div");
  bar.classList.add("bar");

  let largura = (j.pontos / maxPontos) * 100;

  bar.style.width = largura + "%";
  bar.textContent = `${j.nome} (${j.pontos})`;

  graficoTodos.appendChild(bar);
});

// ----------------------
// Gráfico TOP 3 (acertos)
// ----------------------
const graficoTop3 = document.getElementById("graficoTop3");
let maxAcertos = Math.max(...top3.map(j => j.acertos));

top3.forEach(j => {
  let bar = document.createElement("div");
  bar.classList.add("bar");

  let largura = (j.acertos / maxAcertos) * 100;

  bar.style.width = largura + "%";
  bar.textContent = `${j.nome} (${j.acertos})`;

  graficoTop3.appendChild(bar);
});