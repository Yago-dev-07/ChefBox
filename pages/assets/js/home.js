const listaDestaque = document.getElementById("lista-destaque");

function embaralharReceitasHome(lista) {
    const receitasEmbaralhadas = lista.slice();

    for (let i = receitasEmbaralhadas.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(Math.random() * (i + 1));

        const temporaria = receitasEmbaralhadas[i];
        receitasEmbaralhadas[i] = receitasEmbaralhadas[indiceAleatorio];
        receitasEmbaralhadas[indiceAleatorio] = temporaria;
    }

    return receitasEmbaralhadas;
}

function exibirDestaquesHome(receitas) {
    listaDestaque.innerHTML = "";

    if (receitas.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhuma receita disponível no momento.";
        listaDestaque.appendChild(mensagem);
        return;
    }

    receitas.forEach(function(receita) {
        const card = document.createElement("article");
        card.classList.add("card-receita");

        const botaoFavorito = document.createElement("button");
        botaoFavorito.type = "button";
        botaoFavorito.classList.add("botao-favorito");

        const coracao = document.createElement("i");
        botaoFavorito.appendChild(coracao);

        function atualizarFavorito() {
            const favorito = verificarFavorito(receita.id);

            coracao.className = favorito
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";

            botaoFavorito.setAttribute(
                "aria-label",
                favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
            );
        }

        atualizarFavorito();

        botaoFavorito.addEventListener("click", function() {
            alternarFavorito(receita.id);
            atualizarFavorito();
        });

        const link = document.createElement("a");
        link.classList.add("link-receita");
        link.href = "pages/receita.html?id=" + encodeURIComponent(receita.id);

        const imagem = document.createElement("img");
        const caminhoImagem = receita.imagem || "";

        if (caminhoImagem.startsWith("data:") ||
            caminhoImagem.startsWith("http")) {
            imagem.src = caminhoImagem;
        } else {
            imagem.src = "pages/assets/img/" + (
                caminhoImagem || "hero-pagina-inicial.png"
            );
        }

        imagem.alt = receita.nome;

        const categoria = document.createElement("span");
        categoria.classList.add("categoria-receita");
        categoria.dataset.categoria = receita.categoria || "outras";

        const nomeCategoria = receita.categoria || "outras";
        categoria.textContent = nomeCategoria.charAt(0).toUpperCase()
            + nomeCategoria.slice(1);

        const titulo = document.createElement("h3");
        titulo.textContent = receita.nome;

        const informacoes = document.createElement("div");
        informacoes.classList.add("info-destaque");

        let tempo = receita.tempoPreparo || "Não informado";

        if (typeof tempo === "number") {
            const horas = Math.floor(tempo / 60);
            const minutos = tempo % 60;

            tempo = horas > 0 ? horas + "h" : "";

            if (minutos > 0) {
                tempo += minutos + "min";
            }
        }

        const tempoTexto = document.createElement("span");
        const iconeTempo = document.createElement("i");
        iconeTempo.classList.add("fa-regular", "fa-clock");
        tempoTexto.appendChild(iconeTempo);
        tempoTexto.append(" " + tempo);

        const dificuldades = {
            facil: "Fácil",
            medio: "Médio",
            dificil: "Difícil"
        };

        const dificuldadeTexto = document.createElement("span");
        const iconeDificuldade = document.createElement("i");
        iconeDificuldade.classList.add("fa-solid", "fa-chart-simple");

        dificuldadeTexto.appendChild(iconeDificuldade);
        dificuldadeTexto.append(
            " " + (dificuldades[receita.dificuldade]
                || receita.dificuldade
                || "Não informado")
        );

        informacoes.appendChild(tempoTexto);
        informacoes.appendChild(dificuldadeTexto);

        link.appendChild(imagem);
        link.appendChild(categoria);
        link.appendChild(titulo);
        link.appendChild(informacoes);

        card.appendChild(botaoFavorito);
        card.appendChild(link);

        listaDestaque.appendChild(card);
    });
}

async function carregarDestaquesHome() {
    const receitasLocais = carregarReceitas();

    const receitasIniciais = receitasLocais.filter(function(receita) {
        return !receitaEstaOculta(receita.id);
    });

    exibirDestaquesHome(
        embaralharReceitasHome(receitasIniciais).slice(0, 5)
    );

    const resultados = await Promise.allSettled([
        buscarReceitasAPI(),
        buscarReceitasSpoonacular("")
    ]);

    let receitasExternas = [];

    resultados.forEach(function(resultado) {
        if (resultado.status === "fulfilled") {
            receitasExternas = receitasExternas.concat(resultado.value);
        }
    });

    const todasReceitas = receitasLocais.concat(receitasExternas);

    const receitasUnicas = [];
    const idsEncontrados = new Set();

    todasReceitas.forEach(function(receita) {
        const id = String(receita.id);

        if (receitaEstaOculta(id) || idsEncontrados.has(id)) {
            return;
        }

        idsEncontrados.add(id);
        receitasUnicas.push(receita);
    });

    const destaques = embaralharReceitasHome(receitasUnicas).slice(0, 5);

    exibirDestaquesHome(destaques);
}

carregarDestaquesHome();

const formularioPesquisaHome = document.querySelector(".form-pesquisa");
const campoPesquisaHome = document.getElementById("pesquisa");

formularioPesquisaHome.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const pesquisa = campoPesquisaHome.value.trim();

    if (pesquisa === "") {
        window.location.href = "pages/receitas.html";
        return;
    }

    window.location.href = "pages/receitas.html?pesquisa="
        + encodeURIComponent(pesquisa);
});