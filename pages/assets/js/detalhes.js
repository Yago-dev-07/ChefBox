const parametros = new URLSearchParams(window.location.search);

const idReceita = parametros.get("id");
const receitas = carregarReceitas();

let receitaSelecionada = receitas.find(function(receita) {
    return String(receita.id) === idReceita;
});

const imagem = document.getElementById("imagem-receita");
const categoria = document.getElementById("categoria-receita");
const nome = document.getElementById("nome-receita");
const tempoPreparo = document.getElementById("tempo-receita");
const dificuldade = document.getElementById("dificuldade-receita");
const descricao = document.getElementById("descricao-receita");
const listaIngredientes = document.getElementById("lista-ingredientes");
const listaPreparo = document.getElementById("lista-preparo");
const tempoAdicional = document.getElementById("tempo-adicional");
const rendimentoAdicional = document.getElementById("rendimento-adicional");
const dificuldadeAdicional = document.getElementById("dificuldade-adicional");
const detalhesReceita = document.getElementById("detalhes-receita");
const botaoEditar = document.getElementById("botao-editar");
const botaoExcluir = document.getElementById("botao-excluir");
const modalExclusao = document.getElementById("modal-exclusao");
const mensagemModal = document.getElementById("mensagem-modal");
const cancelarExclusao = document.getElementById("cancelar-exclusao");
const confirmarExclusao = document.getElementById("confirmar-exclusao");
const botaoFavoritar = document.getElementById("botao-favoritar");
const iconeFavoritar = botaoFavoritar.querySelector("i");
const textoFavoritar = document.getElementById("texto-favoritar");
const creditoSpoonacular = document.getElementById("credito-spoonacular");

function atualizarBotaoFavorito() {
    if (verificarFavorito(receitaSelecionada.id)) {
        iconeFavoritar.classList.remove("fa-regular");
        iconeFavoritar.classList.add("fa-solid");

        textoFavoritar.textContent = "Remover dos Favoritos";
        botaoFavoritar.setAttribute("aria-label", "Remover dos favoritos");
    } else {
        iconeFavoritar.classList.remove("fa-solid");
        iconeFavoritar.classList.add("fa-regular");
        textoFavoritar.textContent = "Favoritar";
        botaoFavoritar.setAttribute("aria-label", "Adicionar aos favoritos");
    }
}

function exibirDetalhes() {
    nome.textContent = receitaSelecionada.nome;
    document.title = receitaSelecionada.nome + " - ChefBox";
    categoria.textContent = receitaSelecionada.categoria.charAt(0).toUpperCase()
    + receitaSelecionada.categoria.slice(1);

    if (receitaSelecionada.imagem.startsWith("data:") || receitaSelecionada.imagem.startsWith("http")) {
        imagem.src = receitaSelecionada.imagem;
    } else {
        imagem.src = "assets/img/" + receitaSelecionada.imagem;
    }

    imagem.alt = receitaSelecionada.nome;

    let tempo = receitaSelecionada.tempoPreparo;

    if (typeof tempo === "number") {
        if (tempo >= 60) {
            const horas = parseInt(tempo / 60);
            const minutos = tempo % 60;

            tempo = horas + "h";

            if (minutos > 0) {
                tempo += minutos + "min";
            }
        } else {
            tempo = tempo + "min";
        }
    }

    tempoPreparo.textContent = tempo;

    let dificuldadeTexto = receitaSelecionada.dificuldade;

    if (dificuldadeTexto === "facil") {
        dificuldadeTexto = "Fácil";
    } else if (dificuldadeTexto === "medio") {
        dificuldadeTexto = "Médio";
    } else if (dificuldadeTexto === "dificil") {
        dificuldadeTexto = "Difícil";
    }

    dificuldade.textContent = dificuldadeTexto;

    if (receitaSelecionada.descricao) {
        descricao.textContent = receitaSelecionada.descricao;
    } else {
        descricao.textContent = "Descrição não disponível para esta receita.";
    }

    exibirIngredientes();
    exibirModoPreparo();
    exibirInformacoesAdicionais();
 }

async function carregarDetalhesReceita() {
    const ehReceitaExterna = idReceita && (idReceita.startsWith("api-") || idReceita.startsWith("spoon-"));

    if (ehReceitaExterna && receitaEstaOculta(idReceita)) {
        exibirReceitaNaoEncontrada();
        return;
    }

    if (!receitaSelecionada && idReceita && idReceita.startsWith("api-")) {
        receitaSelecionada = await buscarReceitaPorIdAPI(idReceita);
    }

    if (!receitaSelecionada && idReceita && idReceita.startsWith("spoon-")) {
        receitaSelecionada = await buscarReceitaPorIdSpoonacular(idReceita);
    }

    if (!receitaSelecionada) {
        exibirReceitaNaoEncontrada();
        return;
    }

    exibirDetalhes();
    const ehSpoonacularOriginal = receitaSelecionada.origem === "spoonacular";

    creditoSpoonacular.hidden = !(ehSpoonacularOriginal || receitaSelecionada.fonte === "spoonacular");

    botaoEditar.hidden = false;
    botaoExcluir.hidden = false;
    botaoFavoritar.hidden = false;

    botaoEditar.addEventListener("click", function() {
        window.location.href = "cadastrar_receita.html?id=" + receitaSelecionada.id;
    });

    botaoExcluir.addEventListener("click", function() {
        abrirModalExclusao();
    });

    cancelarExclusao.addEventListener("click", function() {
        fecharModalExclusao();
    });

    confirmarExclusao.addEventListener("click", function() {
        excluirReceita();
    });

    atualizarBotaoFavorito();

    botaoFavoritar.addEventListener("click", function() {
        alternarFavorito(receitaSelecionada.id);
        atualizarBotaoFavorito();
    });
    
}

carregarDetalhesReceita();

function exibirIngredientes() {
    listaIngredientes.innerHTML = "";

    if (!receitaSelecionada.ingredientes) {
        listaIngredientes.textContent = "Ingredientes não disponíveis.";
        return;
    }

    const ingredientes = receitaSelecionada.ingredientes.split("\n");

    ingredientes.forEach(function(ingrediente) {
        if (ingrediente.trim() !== "") {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.name = "ingredientes";
            checkbox.value = ingrediente.trim();

            label.appendChild(checkbox);
            label.append(" " + ingrediente.trim());

            listaIngredientes.appendChild(label);
        }
    });
}

function exibirModoPreparo() {
    listaPreparo.innerHTML = "";

    if (!receitaSelecionada.modoPreparo) {
        const mensagem = document.createElement("li");
        mensagem.textContent = "Modo de preparo não disponível.";
        listaPreparo.appendChild(mensagem);
        return;
    }

    const etapas = receitaSelecionada.modoPreparo.split("\n");

    etapas.forEach(function(etapa) {
        if (etapa.trim() !== "") {
            const item = document.createElement("li");
            item.textContent = etapa.trim();

            listaPreparo.appendChild(item);
        }
    });
}

function exibirInformacoesAdicionais() {
    tempoAdicional.textContent = tempoPreparo.textContent;

    dificuldadeAdicional.textContent = dificuldade.textContent;

    if (receitaSelecionada.rendimento) {
        rendimentoAdicional.textContent = receitaSelecionada.rendimento;
    } else {
        rendimentoAdicional.textContent = "Não informado";
    }
}

function exibirReceitaNaoEncontrada() {
    detalhesReceita.innerHTML = "";

    const mensagem = document.createElement("div");
    mensagem.classList.add("receita-nao-encontrada");

    const icone = document.createElement("i");
    icone.classList.add("fa-solid", "fa-circle-exclamation");

    const titulo = document.createElement("h1");
    titulo.textContent = "Receita não encontrada";

    const descricaoErro = document.createElement("p");
    descricaoErro.textContent = "A receita que você está procurando não existe ou não está mais disponível.";

    const link = document.createElement("a");
    link.href = "receitas.html";
    link.classList.add("voltar-listagem");

    const iconeVoltar = document.createElement("i");
    iconeVoltar.classList.add("fa-solid", "fa-arrow-left");

    link.appendChild(iconeVoltar);
    link.append("Voltar para receitas");

    mensagem.appendChild(icone);
    mensagem.appendChild(titulo);
    mensagem.appendChild(descricaoErro);
    mensagem.appendChild(link);

    detalhesReceita.appendChild(mensagem);

    document.title = "Receita não encontrada - ChefBox";
}

function excluirReceita() {
    if (String(receitaSelecionada.id).startsWith("api-") || String(receitaSelecionada.id).startsWith("spoon-")) {
        ocultarReceitaAPI(receitaSelecionada.id);
    }

    const receitasAtualizadas = receitas.filter(function(receita) {
        return String(receita.id) !== String(receitaSelecionada.id);
    });

    salvarReceitas(receitasAtualizadas);

    const favoritosAtualizados = carregarFavoritos().filter(function(id) {
        return String(id) !== String(receitaSelecionada.id);
    });

    salvarFavoritos(favoritosAtualizados);

    window.location.href = "receitas.html";
}


function abrirModalExclusao() {
    mensagemModal.textContent = "Tem certeza que deseja excluir a receita \"" + receitaSelecionada.nome + "\"? Esta ação não poderá ser desfeita.";
    
    modalExclusao.hidden = false;

    cancelarExclusao.focus();
}

function fecharModalExclusao() {
    modalExclusao.hidden = true;

    botaoExcluir.focus();
}

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && !modalExclusao.hidden) {
        fecharModalExclusao();
    }
});

modalExclusao.addEventListener("click", function(evento) {
    if (evento.target === modalExclusao) {
        fecharModalExclusao();
    }
});