class Bolao {
  constructor() {
    this.usuarios = {};
    this.jogos = {};
    this.apostas = {};
    this.pontuacoes = {};
    this.jogosProcessados = new Set();
  }

  adicionarUsuario(nomeUsuario) {
    const normalizedNome = nomeUsuario.toLowerCase().trim();
    if (!this.usuarios[normalizedNome]) {
      this.usuarios[normalizedNome] = {
        nome: nomeUsuario,
        apostasRealizadas: new Set()
      };
      this.pontuacoes[normalizedNome] = 0;
      return true;
    }
    return false;
  }

  adicionarJogo(idJogo, timeA, timeB) {
    if (!this.jogos[idJogo]) {
      this.jogos[idJogo] = {
        id: idJogo,
        timeA: timeA,
        timeB: timeB,
        golsA: null,
        golsB: null,
        apostas: new Set()
      };
      return true;
    }
    return false;
  }

  fazerAposta(nomeUsuario, idJogo, tipoAposta, palpiteA = null, palpiteB = null) {
    const normalizedNome = nomeUsuario.toLowerCase().trim();
    
    if (!this.usuarios[normalizedNome]) {
      throw new Error("Usuário não existe");
    }
    if (!this.jogos[idJogo]) {
      throw new Error("Jogo não existe");
    }
    if (this.usuarios[normalizedNome].apostasRealizadas.has(idJogo)) {
      throw new Error("Usuário já fez aposta neste jogo");
    }
    if (this.jogos[idJogo].golsA !== null) {
      throw new Error("Resultado já registrado para este jogo");
    }

    if (tipoAposta === "duplo") {
      if (palpiteA === null || palpiteB === null) {
        throw new Error("Palpites incompletos para aposta dupla");
      }
      const aposta = {
        usuario: nomeUsuario,
        jogo: idJogo,
        tipo: "duplo",
        palpiteA: palpiteA,
        palpiteB: palpiteB
      };
      this.apostas[`${normalizedNome}_${idJogo}`] = aposta;
    } else if (tipoAposta === "empate") {
      if (palpiteA !== null || palpiteB !== null) {
        throw new Error("Não pode informar palpites para aposta de empate");
      }
      const aposta = {
        usuario: nomeUsuario,
        jogo: idJogo,
        tipo: "empate"
      };
      this.apostas[`${normalizedNome}_${idJogo}`] = aposta;
    } else {
      throw new Error("Tipo de aposta inválido");
    }

    this.usuarios[normalizedNome].apostasRealizadas.add(idJogo);
    this.jogos[idJogo].apostas.add(`${normalizedNome}_${idJogo}`);
    return true;
  }

  registrarResultado(idJogo, golsA, golsB) {
    if (this.jogos[idJogo]) {
      if (this.jogosProcessados.has(idJogo)) {
        throw new Error("Resultado já registrado para este jogo");
      }
      
      this.jogos[idJogo].golsA = golsA;
      this.jogos[idJogo].golsB = golsB;
      this.processarApostas(idJogo);
      this.jogosProcessados.add(idJogo);
      return true;
    }
    return false;
  }

  processarApostas(idJogo) {
    const jogo = this.jogos[idJogo];
    const golsAReal = jogo.golsA;
    const golsBReal = jogo.golsB;

    for (const idAposta of jogo.apostas) {
      const aposta = this.apostas[idAposta];
      const normalizedNome = aposta.usuario.toLowerCase().trim();
      const usuario = this.usuarios[normalizedNome];

      if (aposta.tipo === "duplo") {
        const palpiteA = aposta.palpiteA;
        const palpiteB = aposta.palpiteB;

        if (palpiteA === golsAReal && palpiteB === golsBReal) {
          this.pontuacoes[normalizedNome] += 10;
        } else if (palpiteA === golsAReal || palpiteB === golsBReal) {
          this.pontuacoes[normalizedNome] += 7;
        }
      } else if (aposta.tipo === "empate") {
        if (golsAReal === golsBReal) {
          this.pontuacoes[normalizedNome] += 5;
        }
      }
    }
  }

  gerarRanking() {
    return Object.entries(this.pontuacoes)
      .sort(([, a], [, b]) => b - a);
  }

  obterPontuacaoUsuario(nomeUsuario) {
    const normalizedNome = nomeUsuario.toLowerCase().trim();
    return this.pontuacoes[normalizedNome] || 0;
  }

  listarApostas() {
    return Object.values(this.apostas);
  }

  verificarUsuarioDuplicado(nomeUsuario) {
    const normalizedNome = nomeUsuario.toLowerCase().trim();
    return this.usuarios[normalizedNome] !== undefined;
  }
}

const bolao = new Bolao();

// Adicionando jogos iniciais
bolao.adicionarJogo(1, "Flamengo", "Palmeiras");
bolao.adicionarJogo(2, "São Paulo", "Grêmio");

// Event listener para alternar campos de palpite
document.getElementById('tipoAposta').addEventListener('change', function() {
  const palpiteGroup = document.getElementById('palpiteGroup');
  if (this.value === 'empate') {
    palpiteGroup.style.display = 'none';
  } else {
    palpiteGroup.style.display = 'block';
  }
});

function checkDuplicateUser() {
  const usuarioInput = document.getElementById('usuario');
  const userWarning = document.getElementById('userWarning');
  const usuario = usuarioInput.value.trim();

  if (usuario && bolao.verificarUsuarioDuplicado(usuario)) {
    usuarioInput.classList.add('duplicate');
    userWarning.textContent = '⚠️ Este nome de usuário já existe!';
  } else {
    usuarioInput.classList.remove('duplicate');
    userWarning.textContent = '';
  }
}

function fazerAposta() {
  const usuario = document.getElementById('usuario').value;
  const jogo = document.getElementById('jogo').value;
  const tipoAposta = document.getElementById('tipoAposta').value;
  const palpiteA = document.getElementById('palpiteA').value;
  const palpiteB = document.getElementById('palpiteB').value;

  try {
    if (bolao.verificarUsuarioDuplicado(usuario)) {
      throw new Error("Nome de usuário já existe!");
    }

    bolao.adicionarUsuario(usuario);
    bolao.fazerAposta(
      usuario,
      parseInt(jogo),
      tipoAposta,
      tipoAposta === 'duplo' ? parseInt(palpiteA) : null,
      tipoAposta === 'duplo' ? parseInt(palpiteB) : null
    );

    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').innerHTML = `
      <h3>Aposta Registrada!</h3>
      <p><strong>Usuário:</strong> ${usuario}</p>
      <p><strong>Jogo:</strong> ${jogo}</p>
      <p><strong>Tipo:</strong> ${tipoAposta === 'empate' ? 'Empate' : 'Duplo'}</p>
      ${tipoAposta === 'duplo' ? `<p><strong>Palpite:</strong> ${palpiteA} x ${palpiteB}</p>` : ''}
    `;

    atualizarListaApostas();
    atualizarRanking();
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

function registrarResultado() {
  const jogo = document.getElementById('adminJogo').value;
  const golsA = document.getElementById('adminGolsA').value;
  const golsB = document.getElementById('adminGolsB').value;

  try {
    bolao.registrarResultado(parseInt(jogo), parseInt(golsA), parseInt(golsB));
    alert(`Resultado do jogo ${jogo} registrado: ${golsA} x ${golsB}`);
    atualizarRanking();
    atualizarListaApostas();
  } catch (error) {
    alert("Erro ao registrar resultado: " + error.message);
  }
}

function atualizarListaApostas() {
  const apostasList = document.getElementById('apostasList');
  const apostas = bolao.listarApostas();

  apostasList.innerHTML = apostas.map(aposta => {
    const jogo = bolao.jogos[aposta.jogo];
    const status = jogo.golsA !== null ? 
      `<p><strong>Resultado:</strong> ${jogo.golsA} x ${jogo.golsB}</p>` : 
      '<p><strong>Status:</strong> Ainda não registrado</p>';
    
    return `
      <div class="aposta-item">
        <p><strong>Usuário:</strong> ${aposta.usuario}</p>
        <p><strong>Jogo:</strong> ${jogo.timeA} vs ${jogo.timeB}</p>
        <p><strong>Tipo:</strong> ${aposta.tipo === 'empate' ? 'Empate' : 'Duplo'}</p>
        ${aposta.tipo === 'duplo' ? `<p><strong>Palpite:</strong> ${aposta.palpiteA} x ${aposta.palpiteB}</p>` : ''}
        ${status}
      </div>
    `;
  }).join('');
}

function atualizarRanking() {
  const rankingList = document.getElementById('rankingList');
  const ranking = bolao.gerarRanking();

  rankingList.innerHTML = ranking.map(([nome, pontos], index) => `
    <p>${index + 1}. ${nome}: ${pontos} pontos</p>
  `).join('');
}

// Inicializa as listas
atualizarListaApostas();
atualizarRanking();