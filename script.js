class Bolao {

  constructor() {

    this.usuarios = {};
    this.rodadas = {};
    this.apostas = {};

    this.pontuacoes = {};
    this.acertos = {};
  }

  adicionarUsuario(nome) {

    const id = nome.toLowerCase().trim();

    if (!this.usuarios[id]) {

      this.usuarios[id] = { nome };

      this.pontuacoes[id] = 0;
      this.acertos[id] = 0;
    }
  }

  adicionarRodada(numero) {

    if (!this.rodadas[numero]) {

      this.rodadas[numero] = [];
    }
  }

  adicionarJogo(
    rodada,
    id,
    timeA,
    timeB
  ) {

    this.adicionarRodada(rodada);

    this.rodadas[rodada].push({

      id,
      rodada,

      timeA,
      timeB,

      golsA: null,
      golsB: null,

      processado: false
    });
  }

  obterJogo(idJogo) {

    for (const rodada in this.rodadas) {

      const jogo =
        this.rodadas[rodada]
        .find(j => j.id == idJogo);

      if (jogo) return jogo;
    }

    return null;
  }

  fazerAposta(
    usuario,
    jogoId,
    tipo,
    palpiteA,
    palpiteB
  ) {

    this.adicionarUsuario(usuario);

    const usuarioId =
      usuario.toLowerCase().trim();

    const chave =
      `${usuarioId}_${jogoId}`;

    if (this.apostas[chave]) {

      throw new Error(
        "Usuário já apostou neste jogo"
      );
    }

    const jogo =
      this.obterJogo(jogoId);

    this.apostas[chave] = {

      usuario,
      usuarioId,

      jogoId,
      rodada: jogo.rodada,

      tipo,

      palpiteA,
      palpiteB
    };
  }

  registrarResultado(
    jogoId,
    golsA,
    golsB
  ) {

    const jogo =
      this.obterJogo(jogoId);

    if (!jogo) {

      throw new Error(
        "Jogo não encontrado"
      );
    }

    if (jogo.processado) {

      throw new Error(
        "Resultado já registrado"
      );
    }

    jogo.golsA = golsA;
    jogo.golsB = golsB;

    this.processarApostas(jogo);

    jogo.processado = true;
  }

  processarApostas(jogo) {

    Object.values(this.apostas)
    .forEach(aposta => {

      if (aposta.jogoId != jogo.id) return;

      const usuarioId =
        aposta.usuarioId;

      // PLACAR EXATO
      if (

        aposta.palpiteA == jogo.golsA &&
        aposta.palpiteB == jogo.golsB

      ) {

        this.pontuacoes[usuarioId] += 10;
        this.acertos[usuarioId] += 1;
      }

      // ACERTO PARCIAL
      else if (

        aposta.palpiteA == jogo.golsA ||
        aposta.palpiteB == jogo.golsB

      ) {

        this.pontuacoes[usuarioId] += 5;
      }

      // EMPATE
      if (

        aposta.tipo === "empate" &&
        jogo.golsA === jogo.golsB

      ) {

        this.pontuacoes[usuarioId] += 3;
      }
    });
  }

  gerarRanking() {

    return Object.keys(this.usuarios)

    .map(usuarioId => ({

      nome:
        this.usuarios[usuarioId].nome,

      pontos:
        this.pontuacoes[usuarioId],

      acertos:
        this.acertos[usuarioId]

    }))

    .sort((a,b) => b.pontos - a.pontos);
  }

  obterApostasPorRodada(rodada) {

    return Object.values(this.apostas)
      .filter(a => a.rodada == rodada);
  }

}

const bolao = new Bolao();


// ==========================
// RODADA 1
// ==========================

bolao.adicionarJogo(
  1,
  1,
  "Flamengo",
  "Palmeiras"
);

bolao.adicionarJogo(
  1,
  2,
  "São Paulo",
  "Grêmio"
);


// ==========================
// RODADA 2
// ==========================

bolao.adicionarJogo(
  2,
  3,
  "Corinthians",
  "Santos"
);

bolao.adicionarJogo(
  2,
  4,
  "Bahia",
  "Cruzeiro"
);


// ==========================
// SELECTS
// ==========================

function carregarSelects() {

  const jogoSelect =
    document.getElementById("jogo");

  const adminSelect =
    document.getElementById("adminJogo");

  const filtro =
    document.getElementById("filtroRodada");

  jogoSelect.innerHTML = "";
  adminSelect.innerHTML = "";

  for (const rodada in bolao.rodadas) {

    filtro.innerHTML += `
      <option value="${rodada}">
        Rodada ${rodada}
      </option>
    `;

    bolao.rodadas[rodada]
    .forEach(jogo => {

      const texto = `
        Rodada ${rodada}
        -
        ${jogo.timeA}
        x
        ${jogo.timeB}
      `;

      jogoSelect.innerHTML += `
        <option value="${jogo.id}">
          ${texto}
        </option>
      `;

      adminSelect.innerHTML += `
        <option value="${jogo.id}">
          ${texto}
        </option>
      `;
    });
  }
}

carregarSelects();


// ==========================
// TIPO APOSTA
// ==========================

document
.getElementById("tipoAposta")
.addEventListener("change", function() {

  document
  .getElementById("palpiteGroup")
  .style.display =

    this.value === "empate"
      ? "none"
      : "block";
});


// ==========================
// APOSTAR
// ==========================

document
.getElementById("fazerApostaBtn")
.addEventListener("click", () => {

  try {

    const usuario =
      document.getElementById("usuario").value;

    const jogoId =
      parseInt(
        document.getElementById("jogo").value
      );

    const tipo =
      document.getElementById("tipoAposta").value;

    const palpiteA =
      document.getElementById("palpiteA").value;

    const palpiteB =
      document.getElementById("palpiteB").value;

    bolao.fazerAposta(

      usuario,
      jogoId,
      tipo,

      tipo === "duplo"
        ? parseInt(palpiteA)
        : null,

      tipo === "duplo"
        ? parseInt(palpiteB)
        : null
    );

    atualizarTudo();

  } catch (erro) {

    alert(erro.message);
  }
});


// ==========================
// RESULTADO
// ==========================

document
.getElementById("registrarResultadoBtn")
.addEventListener("click", () => {

  try {

    const jogoId =
      parseInt(
        document.getElementById("adminJogo").value
      );

    const golsA =
      parseInt(
        document.getElementById("adminGolsA").value
      );

    const golsB =
      parseInt(
        document.getElementById("adminGolsB").value
      );

    bolao.registrarResultado(
      jogoId,
      golsA,
      golsB
    );

    atualizarTudo();

  } catch (erro) {

    alert(erro.message);
  }
});


// ==========================
// FILTRO RODADA
// ==========================

document
.getElementById("filtroRodada")
.addEventListener("change", () => {

  atualizarApostas();
});


// ==========================
// RANKING
// ==========================

function atualizarRanking() {

  const div =
    document.getElementById("rankingList");

  div.innerHTML = "";

  bolao.gerarRanking()
  .forEach((j,i) => {

    div.innerHTML += `

      <div class="item">

        <span>
          ${i + 1}º ${j.nome}
        </span>

        <span>
          ${j.pontos} pts
        </span>

      </div>
    `;
  });
}


// ==========================
// TOP 3
// ==========================

function atualizarTop3() {

  const div =
    document.getElementById("top3");

  div.innerHTML = "";

  const top3 =
    bolao.gerarRanking()

    .sort((a,b) => b.acertos - a.acertos)

    .slice(0,3);

  top3.forEach((j,i) => {

    div.innerHTML += `

      <div class="item">

        <span>
          ${i + 1}º ${j.nome}
        </span>

        <span>
          ${j.acertos} acertos
        </span>

      </div>
    `;
  });
}


// ==========================
// GRAFICOS
// ==========================

function atualizarGraficos() {

  const div =
    document.getElementById("graficoTodos");

  div.innerHTML = "";

  const ranking =
    bolao.gerarRanking();

  const max =
    Math.max(
      ...ranking.map(j => j.pontos),
      1
    );

  ranking.forEach(j => {

    const largura =
      (j.pontos / max) * 100;

    div.innerHTML += `

      <div
        class="bar"
        style="width:${largura}%"
      >
        ${j.nome} (${j.pontos})
      </div>
    `;
  });
}


// ==========================
// APOSTAS
// ==========================

function atualizarApostas() {

  const container =
    document.getElementById(
      "apostasPorRodada"
    );

  container.innerHTML = "";

  const filtro =
    document.getElementById(
      "filtroRodada"
    ).value;

  for (const rodada in bolao.rodadas) {

    if (
      filtro !== "todas" &&
      filtro != rodada
    ) {
      continue;
    }

    const apostas =
      bolao.obterApostasPorRodada(rodada);

    let html = `

      <div class="rodada-box">

        <div class="rodada-title">

          Rodada ${rodada}

        </div>
    `;

    if (apostas.length === 0) {

      html += `
        <p>Nenhuma aposta.</p>
      `;
    }

    apostas.forEach(aposta => {

      const jogo =
        bolao.obterJogo(aposta.jogoId);

      html += `

        <div class="aposta-item">

          <span>

            <strong>
              ${aposta.usuario}
            </strong>

            -

            ${jogo.timeA}
            x
            ${jogo.timeB}

          </span>

          <span>

            ${
              aposta.tipo === "empate"

              ? "Empate"

              : `${aposta.palpiteA} x ${aposta.palpiteB}`
            }

          </span>

        </div>
      `;
    });

    html += `</div>`;

    container.innerHTML += html;
  }
}


// ==========================
// ATUALIZAR TUDO
// ==========================

function atualizarTudo() {

  atualizarRanking();

  atualizarTop3();

  atualizarGraficos();

  atualizarApostas();
}

atualizarTudo();