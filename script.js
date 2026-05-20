class Bolao {
  constructor() {
    this.usuarios = {};
    this.jogos = {};
    this.apostas = {};
    this.pontuacoes = {};
  }

  // Adiciona um novo usuário
  adicionarUsuario(nomeUsuario) {
    if (!this.usuarios[nomeUsuario]) {
      this.usuarios[nomeUsuario] = {
        nome: nomeUsuario,
        apostasRealizadas: new Set()
      };
      this.pontuacoes[nomeUsuario] = 0;
      return true;
    }
    return false;
  }

  // Adiciona um novo jogo
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

  // Registra o resultado oficial do jogo
  registrarResultado(idJogo, golsA, golsB) {
    if (this.jogos[idJogo]) {
      this.jogos[idJogo].golsA = golsA;
      this.jogos[idJogo].golsB = golsB;
      this.processarApostas(idJogo);
      return true;
    }
    return false;
  }

  // Faz uma aposta
  fazerAposta(nomeUsuario, idJogo, tipoAposta, palpiteA = null, palpiteB = null) {
    if (!this.usuarios[nomeUsuario]) {
      throw new Error("Usuário não existe");
    }
    if (!this.jogos[idJogo]) {
      throw new Error("Jogo não existe");
    }
    if (this.usuarios[nomeUsuario].apostasRealizadas.has(idJogo)) {
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
      this.apostas[`${nomeUsuario}_${idJogo}`] = aposta;
    } else if (tipoAposta === "empate") {
      if (palpiteA !== null || palpiteB !== null) {
        throw new Error("Não pode informar palpites para aposta de empate");
      }
      const aposta = {
        usuario: nomeUsuario,
        jogo: idJogo,
        tipo: "empate"
      };
      this.apostas[`${nomeUsuario}_${idJogo}`] = aposta;
    } else {
      throw new Error("Tipo de aposta inválido");
    }

    this.usuarios[nomeUsuario].apostasRealizadas.add(idJogo);
    this.jogos[idJogo].apostas.add(`${nomeUsuario}_${idJogo}`);
    return true;
  }

  // Processa as apostas de um jogo após o resultado
  processarApostas(idJogo) {
    const jogo = this.jogos[idJogo];
    const golsAReal = jogo.golsA;
    const golsBReal = jogo.golsB;

    for (const idAposta of jogo.apostas) {
      const aposta = this.apostas[idAposta];
      const usuario = aposta.usuario;

      if (aposta.tipo === "duplo") {
        const palpiteA = aposta.palpiteA;
        const palpiteB = aposta.palpiteB;

        if (palpiteA === golsAReal && palpiteB === golsBReal) {
          this.pontuacoes[usuario] += 10;
        } else if (palpiteA === golsAReal || palpiteB === golsBReal) {
          this.pontuacoes[usuario] += 7;
        }
      } else if (aposta.tipo === "empate") {
        if (golsAReal === golsBReal) {
          this.pontuacoes[usuario] += 5;
        }
      }
    }
  }

  // Gera o ranking de pontuação
  gerarRanking() {
    return Object.entries(this.pontuacoes)
      .sort(([, a], [, b]) => b - a);
  }

  // Obtém a pontuação de um usuário
  obterPontuacaoUsuario(nomeUsuario) {
    return this.pontuacoes[nomeUsuario] || 0;
  }
}

// Exemplo de uso
const bolao = new Bolao();

// Adicionando usuários
bolao.adicionarUsuario("João");
bolao.adicionarUsuario("Maria");
bolao.adicionarUsuario("Pedro");

// Adicionando jogos
bolao.adicionarJogo(1, "Flamengo", "Palmeiras");
bolao.adicionarJogo(2, "São Paulo", "Grêmio");

// Fazendo apostas
bolao.fazerAposta("João", 1, "duplo", 2, 1);       // Palpite: Flamengo 2 x 1 Palmeiras
bolao.fazerAposta("Maria", 1, "empate");            // Aposta em empate
bolao.fazerAposta("Pedro", 1, "duplo", 1, 2);      // Palpite: Flamengo 1 x 2 Palmeiras
bolao.fazerAposta("Maria", 2, "duplo", 0, 0);      // Palpite: São Paulo 0 x 0 Grêmio

// Registrando resultados oficiais
bolao.registrarResultado(1, 2, 1);  // Flamengo 2 x 1 Palmeiras
bolao.registrarResultado(2, 0, 0);  // São Paulo 0 x 0 Grêmio

// Exibindo pontuações
console.log("Pontuações:");
for (const [nome, pontos] of Object.entries(bolao.pontuacoes)) {
  console.log(`${nome}: ${pontos} pontos`);
}

// Gerando ranking
const ranking = bolao.gerarRanking();
console.log("\nRanking:");
ranking.forEach(([nome, pontos], index) => {
  console.log(`${index + 1}. ${nome}: ${pontos} pontos`);
});