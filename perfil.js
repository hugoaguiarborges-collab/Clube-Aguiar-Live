// Configuração do Firebase (mesma do index/ranking)
const firebaseConfig = {
  apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
  authDomain: "clube-aguiar-live.firebaseapp.com",
  projectId: "clube-aguiar-live",
  storageBucket: "clube-aguiar-live.firebasestorage.app",
  messagingSenderId: "694025911850",
  appId: "1:694025911850:web:5f0c6117dbc60b15118d53"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Função para buscar atleta pelo nome
async function buscarAtleta(nome) {
  // Buscar todos usuários, filtrar pelo nome (case insensitive)
  const snap = await db.collection("usuarios").get();
  let atleta = null;
  snap.forEach(doc => {
    const d = doc.data();
    if (d.nome && d.nome.toLowerCase().trim() === nome.toLowerCase().trim()) {
      atleta = { ...d, id: doc.id };
    }
  });
  return atleta;
}

// Função para montar a interface do perfil
async function carregarPerfil() {
  const nome = getQueryParam("nome");
  const box = document.getElementById("perfilBox");
  box.innerHTML = ""; // Limpa

  if (!nome) {
    box.innerHTML = `<div class="notfound">Atleta não encontrada</div>
    <button class="voltar-btn" onclick="window.location.href='index.html'">← Voltar ao Ranking</button>`;
    return;
  }

  const atleta = await buscarAtleta(nome);
  if (!atleta) {
    box.innerHTML = `<div class="notfound">Atleta não encontrada</div>
    <button class="voltar-btn" onclick="window.location.href='index.html'">← Voltar ao Ranking</button>`;
    return;
  }

  // Selos
  let selos = (Array.isArray(atleta.selos) && atleta.selos.length)
    ? `Selos conquistados: ${atleta.selos.join(", ")}`
    : "Nenhum selo conquistado ainda.";

  // Pontos
  let pontos = typeof atleta.pontos === "number" ? atleta.pontos : 0;

  // Histórico
  let historico = Array.isArray(atleta.historico) && atleta.historico.length
    ? atleta.historico
    : [];

  let historicoHtml = historico.length
    ? `<ul class="historico-list">${historico.map(h => `<li>${h}</li>`).join('')}</ul>`
    : `<div style="color:#fffde5;font-size:0.98rem;">Nenhum check-in registrado ainda.</div>`;

  // Título + botão de voltar
  box.innerHTML = `
    <div class="perfil-nome">${atleta.nome}</div>
    <div class="perfil-selos">${selos}</div>
    <div class="perfil-pontos">${pontos} pts</div>
    <div class="historico-title">Histórico de treinos:</div>
    ${historicoHtml}
    <div class="grafico-title">Evolução no Ranking</div>
    <canvas id="graficoEvolucao"></canvas>
    <button class="voltar-btn" onclick="window.location.href='index.html'">← Voltar ao Ranking</button>
  `;

  // Gráfico de evolução
  let posicoes = [];
  if (Array.isArray(atleta.posicoes) && atleta.posicoes.length > 0) {
    posicoes = atleta.posicoes
      .filter(p => p.data && p.posicao) // só pega entradas válidas
      .map(p => ({
        data: p.data,
        posicao: Number(p.posicao)
      }));
  }

  // Caso não tenha dados suficientes para montar gráfico, mostra mensagem
  if (!posicoes.length) {
    // Mostra um gráfico zerado, mas com label informativa
    criarGraficoEvolucao([{ data: "Sem registro", posicao: 0 }]);
    // Ou, se preferir, pode mostrar uma mensagem em vez do gráfico:
    // document.getElementById("graficoEvolucao").style.display = "none";
    // box.innerHTML += `<div style="color:#fffde5;font-size:0.98rem;">Nenhuma evolução registrada ainda.</div>`;
  } else {
    criarGraficoEvolucao(posicoes);
  }
}

function criarGraficoEvolucao(posicoes) {
  const ctx = document.getElementById('graficoEvolucao').getContext('2d');
  const labels = posicoes.map(p => p.data);
  const data = posicoes.map(p => p.posicao);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Posição no Ranking',
        data: data,
        fill: false,
        borderColor: 'rgb(255, 193, 7)',
        backgroundColor: 'rgba(255, 193, 7, 0.3)',
        tension: 0.18,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(255,193,7)'
      }]
    },
    options: {
      scales: {
        y: {
          reverse: true,
          beginAtZero: false,
          title: { display: true, text: 'Posição' },
          min: 1, // Ranking começa em 1
          // Se quiser sempre mostrar até o último lugar, pode usar max aqui
        }
      },
      plugins: {
        legend: { display: true }
      }
    }
  });
}

// Inicializar ao carregar página
window.onload = carregarPerfil;
