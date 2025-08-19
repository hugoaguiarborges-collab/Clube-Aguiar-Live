
// Exemplo simples de ranking
let ranking = [
    { nome: "Maria", pontos: 120 },
    { nome: "Ana", pontos: 95 },
    { nome: "Cláudia", pontos: 150 }
];

function atualizarRanking() {
    ranking.sort((a, b) => b.pontos - a.pontos);

    let tabela = document.getElementById("ranking-body");
    tabela.innerHTML = "";

    ranking.forEach((jogador, index) => {
        let linha = `<tr>
            <td>${index + 1}º</td>
            <td>${jogador.nome}</td>
            <td>${jogador.pontos}</td>
        </tr>`;
        tabela.innerHTML += linha;
    });
}

function adicionarPontos(nome, pontos) {
    let jogador = ranking.find(j => j.nome === nome);
    if (jogador) {
        jogador.pontos += pontos;
    } else {
        ranking.push({ nome, pontos });
    }
    atualizarRanking();
}

window.onload = atualizarRanking;
