// Exemplo: pegar o nome do atleta pelo parâmetro da URL (?nome=Francisca Souza)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Dados fictícios para exemplo. Substitua por integração com Firebase ou seu JSON.
const atletas = {
  "Francisca Souza": {
    nome: "Francisca Souza",
    selos: ["Selo Ouro", "Selo Consistência"],
    treinos: [
      { data: "01/08/2025", tipo: "Funcional" },
      { data: "05/08/2025", tipo: "Yoga" },
      { data: "10/08/2025", tipo: "HIIT" }
    ],
    posicoes: [
      { data: "01/08/2025", posicao: 1 },
      { data: "05/08/2025", posicao: 3 },
      { data: "10/08/2025", posicao: 1 }
    ]
  },
  // Adicione outros atletas aqui
};

// Carregar dados do atleta
function carregarPerfil() {
  const nome = getQueryParam("nome");
  const atleta = atletas[nome];
  if (!atleta) {
    document.getElementById("perfil-nome").textContent = "Atleta não encontrada";
    return;
  }
  document.getElementById("perfil-nome").textContent = atleta.nome;
  document.getElementById("perfil-selos").textContent = atleta.selos.join(', ');

  // Histórico de treinos
  const treinosUl = document.getElementById("perfil-treinos");
  treinosUl.innerHTML = "";
  atleta.treinos.forEach(treino => {
    const li = document.createElement("li");
    li.textContent = `${treino.data} - ${treino.tipo}`;
    treinosUl.appendChild(li);
  });

  // Gráfico de evolução das posições
  criarGraficoEvolucao(atleta.posicoes);
}

// Função para criar gráfico com Chart.js
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
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          reverse: true, // Menor número é melhor posição
          beginAtZero: false,
          title: { display: true, text: 'Posição' }
        }
      }
    }
  });
}

// Inicializar ao carregar página
window.onload = carregarPerfil;
