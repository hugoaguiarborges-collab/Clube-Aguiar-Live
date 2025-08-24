// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
  authDomain: "clube-aguiar-live.firebaseapp.com",
  projectId: "clube-aguiar-live",
  storageBucket: "clube-aguiar-live.firebasestorage.app",
  messagingSenderId: "694025911850",
  appId: "1:694025911850:web:5f0c6117dbc60b15118d53"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para determinar a classe do selo
function seloClass(selo) {
  if(selo==='Ouro') return 'ouro';
  if(selo==='Prata') return 'prata';
  if(selo==='Bronze') return 'bronze';
  if(selo==='Destaque') return 'destaque';
  return '';
}

let todasAlunas = [];

// Renderiza o ranking a partir dos dados do Firestore
async function renderRanking() {
  try {
    const snap = await db.collection("usuarios").orderBy("pontos","desc").get();
    todasAlunas = [];
    snap.forEach(doc => {
      const d = doc.data();
      todasAlunas.push({
        nome: d.nome || "Sem nome",
        pontos: d.pontos ?? 0,
        selos: Array.isArray(d.selos) ? d.selos : []
      });
    });
    desenharRanking(todasAlunas);
  } catch (error) {
    // Mostra erro no console e na tela
    console.error("Erro ao carregar ranking:", error);
    document.getElementById("podiumRow").innerHTML = "<div style='color:red'>Erro ao carregar ranking.</div>";
    document.getElementById("rankingList").innerHTML = "";
  }
}

// Desenha o ranking, pódio e lista completa
function desenharRanking(alunas){
  // PÓDIO (primeiros 3 lugares)
  let podiumHtml = "";
  const medalInfos = [
    {label:"Ouro", cls:"ouro", base:"ouro"},
    {label:"Prata", cls:"prata", base:"prata"},
    {label:"Bronze", cls:"bronze", base:"bronze"}
  ];
  for(let i=0;i<3;i++){
    const a = alunas[i];
    if(!a) continue;
    podiumHtml += `
      <div class="podium-card ${medalInfos[i].cls}">
        <span class="podium-selo ${medalInfos[i].cls}">${medalInfos[i].label}</span>
        <div class="podium-nome">
          <a href="perfil.html?nome=${encodeURIComponent(a.nome)}" style="color: inherit; text-decoration: underline; cursor: pointer;">
            ${a.nome}
          </a>
        </div>
        <div class="podium-pontos">${a.pontos} pts</div>
        <div class="podium-base ${medalInfos[i].base}"></div>
      </div>
    `;
  }
  document.getElementById("podiumRow").innerHTML = podiumHtml;

  // LISTA COMPLETA (a partir do 4º lugar)
  let listHtml = "";
  for(let i=3;i<alunas.length;i++){
    const a = alunas[i];
    listHtml += `
      <li class="ranking-list-item">
        <span class="pos-ball">${i+1}</span>
        <span class="ranking-list-nome">
          <a href="perfil.html?nome=${encodeURIComponent(a.nome)}" style="color: inherit; text-decoration: underline; cursor: pointer;">
            ${a.nome}
          </a>
        </span>
        <span class="ranking-list-pontos">${a.pontos} pts</span>
        <span class="ranking-list-selos">
          ${a.selos.map(s=>`<span class="ranking-list-selo ${seloClass(s)}">${s}</span>`).join('')}
        </span>
      </li>
    `;
  }
  document.getElementById("rankingList").innerHTML = listHtml;
}

// Filtra o ranking conforme a pesquisa
function filtrarRanking(){
  const termo = document.getElementById("searchInput").value.toLowerCase().trim();
  if(!termo) { desenharRanking(todasAlunas); return;}
  const filtradas = todasAlunas.filter(a => a.nome.toLowerCase().includes(termo));
  desenharRanking(filtradas);
}

// Inicializa o ranking ao carregar a página
renderRanking();
