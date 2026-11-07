const listaFavoritos = document.getElementById("lista-favoritos");
const formularioPesquisa = document.getElementById("form-pesquisa");
const campoPesquisa = document.getElementById("pesquisa");

let receitasFavoritas = [];

function exibirFavoritos() {
    listaFavoritos.innerHTML = "";

    const textoPesquisa = campoPesquisa.value.trim().toLowerCase();

    const receitasFiltradas = receitasFavoritas.filter(function(receita) {
        return receita.nome.toLowerCase().includes(textoPesquisa);
    });

    if (receitasFavoritas.length === 0) {
        const mensagem = document.createElement("p");

        if (carregarFavoritos().length === 0) {
            mensagem.textContent = "Você ainda não possui receitas favoritas.";
        } else {
            mensagem.textContent = "Não foi possível carregar suas receitas favoritas. Tente atualizar a página.";
        }

        mensagem.classList.add("mensagem-sem-favoritos");
        listaFavoritos.appendChild(mensagem);

        return;
    }

    if(receitasFiltradas.length === 0) {
        const mensagem = document.createElement("p");

        mensagem.textContent = "Nenhuma receita favorita encontrada para sua pesquisa.";
        mensagem.classList.add("mensagem-sem-favoritos");
        listaFavoritos.appendChild(mensagem);

        return;
    }

    receitasFiltradas.forEach(function(receita) {
        const card = document.createElement("article");
        card.classList.add("card-receita");

        const link = document.createElement("a");
        link.classList.add("link-receita");
        link.href = "receita.html?id=" + receita.id;

        const imagem = document.createElement("img");

        if (receita.imagem.startsWith("data:") || receita.imagem.startsWith("http")) {
            imagem.src = receita.imagem;
        } else {
            imagem.src = "assets/img/" + receita.imagem;
        }

        imagem.alt = receita.nome;

        const botaoFavorito = document.createElement("button");
        botaoFavorito.type = "button";
        botaoFavorito.classList.add("icone-favorito");
        botaoFavorito.setAttribute("aria-label", "Remover dos favoritos");

        const coracao = document.createElement("i");
        coracao.classList.add("fa-solid", "fa-heart");

        botaoFavorito.appendChild(coracao);

        botaoFavorito.addEventListener("click", function() {
            alternarFavorito(receita.id);

            receitasFavoritas = receitasFavoritas.filter(function(item) {
                return String(item.id) !== String(receita.id);
            });

            exibirFavoritos();
        });

        const categoria = document.createElement("span");
        categoria.classList.add("categoria-receita");
        categoria.textContent = receita.categoria.charAt(0).toUpperCase()
            + receita.categoria.slice(1);
        categoria.dataset.categoria = receita.categoria;

        const titulo = document.createElement("h3");
        titulo.textContent = receita.nome;

        const informacoes = document.createElement("div");
        informacoes.classList.add("info-destaque");

        const tempo = document.createElement("span");

        const iconeTempo = document.createElement("i");
        iconeTempo.classList.add("fa-regular", "fa-clock");

        let tempoTexto = receita.tempoPreparo;

        if (typeof tempoTexto === "number") {
            if (tempoTexto >= 60) {
                const horas = parseInt(tempoTexto / 60);
                const minutos = tempoTexto % 60;

                tempoTexto = horas + "h";

                if (minutos > 0) {
                    tempoTexto += minutos + "min";
                }
            } else {
                tempoTexto += "min";
            }
        }

        tempo.appendChild(iconeTempo);
        tempo.append(" " + tempoTexto);

        const dificuldade = document.createElement("span");

        const iconeDificuldade = document.createElement("i");
        iconeDificuldade.classList.add("fa-solid", "fa-chart-simple");

        let dificuldadeTexto = receita.dificuldade;

        if (dificuldadeTexto === "facil") {
            dificuldadeTexto = "Fácil";
        } else if (dificuldadeTexto === "medio") {
            dificuldadeTexto = "Médio";
        } else if (dificuldadeTexto === "dificil") {
            dificuldadeTexto = "Difícil";
        }

        dificuldade.appendChild(iconeDificuldade);
        dificuldade.append(" " + dificuldadeTexto);

        informacoes.appendChild(tempo);
        informacoes.appendChild(dificuldade);
        link.appendChild(imagem);
        link.appendChild(categoria);
        link.appendChild(titulo);
        link.appendChild(informacoes);
        card.appendChild(link);
        card.appendChild(botaoFavorito);
        listaFavoritos.appendChild(card);
    });
}

formularioPesquisa.addEventListener("submit", function(evento) {
    evento.preventDefault();

    exibirFavoritos();
});

async function carregarPaginaFavoritos() {
    listaFavoritos.innerHTML = "";

    const mensagem = document.createElement("p");
    mensagem.classList.add("mensagem-sem-favoritos");
    mensagem.textContent = "Carregando receitas favoritas...";

    listaFavoritos.appendChild(mensagem);

    try {
        receitasFavoritas = await carregarReceitasFavoritasComAPI();

        exibirFavoritos();

    } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);

        listaFavoritos.innerHTML = "";

        const aviso = document.createElement("p");
        aviso.classList.add("mensagem-sem-favoritos");
        aviso.textContent = "Não foi possível carregar suas receitas favoritas.";

        listaFavoritos.appendChild(aviso);
    }
}

carregarPaginaFavoritos();