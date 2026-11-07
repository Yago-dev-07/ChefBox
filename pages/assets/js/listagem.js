let receitas = carregarReceitas();

const CHAVE_DATAS_CATALOGO = "chefbox_datas_catalogo";

const datasCatalogo = JSON.parse(
    localStorage.getItem(CHAVE_DATAS_CATALOGO) || "{}"
);

let idsAleatorios = [];

const gradeReceitas = document.getElementById("grade-receitas");
const totalReceitas = document.getElementById("total-receitas");
const campoPesquisa = document.getElementById("pesquisa-filtros");
const parametros = new URLSearchParams(window.location.search);
const pesquisaInicial = parametros.get("pesquisa");
const categoriaInicial = parametros.get("categoria");
const filtrosCategoria = document.querySelectorAll('input[name="categoria"]');
const botaoFiltrar = document.querySelector(".botao-filtrar");
const filtrosTempo = document.querySelectorAll('input[name= "tempo"]');
const filtrosDificuldade = document.querySelectorAll('input[name="dificuldade"]');
const filtroTodas = document.querySelector('input[name="categoria"][value="todas"]');
const botaoLimparFiltros = document.querySelector(".botao-limpar-filtros");
const campoOrdenacao = document.getElementById("ordenacao");

function exibirReceitas(listaReceitas) {
    gradeReceitas.innerHTML = "";
    totalReceitas.textContent = "(" + listaReceitas.length + ")";

    if (listaReceitas.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.classList.add("mensagem-sem-receitas");
        mensagem.textContent = "Nenhuma receita encontrada."

        gradeReceitas.appendChild(mensagem);
        return;
    }

    listaReceitas.forEach(function (receita) {
        const card = document.createElement("article");
        card.classList.add("card-receita");

        const botaoFavorito = document.createElement("button");
        botaoFavorito.type = "button";
        botaoFavorito.classList.add("botao-favorito");

        const iconeFavorito = document.createElement("i");
        iconeFavorito.classList.add("fa-regular", "fa-heart");

        if (verificarFavorito(receita.id)) {
            iconeFavorito.classList.remove("fa-regular");
            iconeFavorito.classList.add("fa-solid");
            botaoFavorito.setAttribute("aria-label", "Remover dos favoritos");
        } else {
            botaoFavorito.setAttribute("aria-label", "Adicionar aos favoritos");
        }

        botaoFavorito.appendChild(iconeFavorito);

        botaoFavorito.addEventListener("click", function () {
            alternarFavorito(receita.id);

            if (verificarFavorito(receita.id)) {
                iconeFavorito.classList.remove("fa-regular");
                iconeFavorito.classList.add("fa-solid");
                botaoFavorito.setAttribute("aria-label", "Remover dos favoritos");
            } else {
                iconeFavorito.classList.remove("fa-solid");
                iconeFavorito.classList.add("fa-regular");
                botaoFavorito.setAttribute("aria-label", "Adicionar aos favoritos");
            }
        });

        const ehSpoonacular = receita.origem === "spoonacular";

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

        const categoria = document.createElement("span");
        categoria.classList.add("categoria-receita");
        categoria.textContent = receita.categoria.charAt(0).toUpperCase() + receita.categoria.slice(1);
        categoria.dataset.categoria = receita.categoria;

        const titulo = document.createElement("h3");
        titulo.textContent = receita.nome;

        const informacoes = document.createElement("div");
        informacoes.classList.add("info-destaque");

        let tempo = receita.tempoPreparo;

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

        let dificuldadeTexto = receita.dificuldade;

        if (dificuldadeTexto === "facil") {
            dificuldadeTexto = "Fácil";
        } else if (dificuldadeTexto === "medio") {
            dificuldadeTexto = "Médio";
        } else if (dificuldadeTexto === "dificil") {
            dificuldadeTexto = "Difícil";
        }

        const infoTempo = document.createElement("span");
        const iconeTempo = document.createElement("i");
        iconeTempo.classList.add("fa-regular", "fa-clock");
        infoTempo.appendChild(iconeTempo);
        infoTempo.append(" " + tempo);

        const infoDificuldade = document.createElement("span");
        const iconeDificuldade = document.createElement("i");
        iconeDificuldade.classList.add("fa-solid", "fa-chart-simple");
        infoDificuldade.appendChild(iconeDificuldade);
        infoDificuldade.append(" " + dificuldadeTexto);

        informacoes.appendChild(infoTempo);
        informacoes.appendChild(infoDificuldade);

        const dataReceita = receita.dataCadastro || datasCatalogo[String(receita.id)];

        const dataFormatada = new Date(dataReceita).toLocaleDateString("pt-BR");

        const textoData = document.createElement("p");
        textoData.classList.add("data-cadastro");

        if (receita.dataCadastro) {
            textoData.textContent = "Cadastrada em: " + dataFormatada;
        } else {
            textoData.textContent = "No catálogo desde: " + dataFormatada;
        }

        link.appendChild(imagem);
        link.appendChild(categoria);
        link.appendChild(titulo);
        link.appendChild(informacoes);
        link.appendChild(textoData);
        card.appendChild(botaoFavorito);
        card.appendChild(link);
        gradeReceitas.appendChild(card);
    });
}

function normalizarTexto(texto) {
    return texto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

campoPesquisa.addEventListener("input", function () {
    aplicarFiltros();
});

function obterCategoriasSelecionadas() {
    const categoriasSelecionadas = [];

    filtrosCategoria.forEach(function (filtro) {
        if (filtro.checked && filtro.value !== "todas") {
            categoriasSelecionadas.push(filtro.value);
        }
    });

    return categoriasSelecionadas;
}

function registrarDatasCatalogo(listaReceitas) {
    let houveAlteracao = false;

    listaReceitas.forEach(function(receita) {
        const id = String(receita.id);

        if (!datasCatalogo[id]) {
            datasCatalogo[id] = receita.dataCadastro
                || new Date().toISOString();

            houveAlteracao = true;
        }
    });

    if (houveAlteracao) {
        localStorage.setItem(
            CHAVE_DATAS_CATALOGO,
            JSON.stringify(datasCatalogo)
        );
    }
}

function obterDataOrdenacao(receita) {
    const data = receita.dataCadastro
        || datasCatalogo[String(receita.id)];

    const valor = new Date(data).getTime();

    return Number.isFinite(valor) ? valor : 0;
}

function ordenarReceitas(listaReceitas) {
    const receitasOrdenadas = listaReceitas.slice();
    const ordenacao = campoOrdenacao.value;

    if (ordenacao === "aleatorias") {
        receitasOrdenadas.sort(function(a, b) {
            const indiceA = idsAleatorios.indexOf(String(a.id));
            const indiceB = idsAleatorios.indexOf(String(b.id));

            return indiceA - indiceB;
        });

    } else if (ordenacao === "recentes" || ordenacao === "antigas") {
        const ordemCadastro = Object.keys(datasCatalogo);

        receitasOrdenadas.sort(function(a, b) {
            const dataA = obterDataOrdenacao(a);
            const dataB = obterDataOrdenacao(b);

            if (dataA !== dataB) {
                if (ordenacao === "recentes") {
                    return dataB - dataA;
                }

                return dataA - dataB;
            }

            const indiceA = ordemCadastro.indexOf(String(a.id));
            const indiceB = ordemCadastro.indexOf(String(b.id));

            if (ordenacao === "recentes") {
                return indiceB - indiceA;
            }

            return indiceA - indiceB;
        });

    } else if (ordenacao === "tempo") {
        receitasOrdenadas.sort(function(a, b) {
            const tempoA = converterTempoMinutos(a.tempoPreparo);
            const tempoB = converterTempoMinutos(b.tempoPreparo);

            return tempoA - tempoB;
        });
    }

    return receitasOrdenadas;
}

function aplicarFiltros() {
    const textoPesquisado = normalizarTexto(campoPesquisa.value.trim());
    const categoriasSelecionadas = obterCategoriasSelecionadas();
    const temposSelecionados = obterTemposSelecionados();
    const dificuldadesSelecionadas = obterDificuldadesSelecionadas();

    const receitasFiltradas = receitas.filter(function (receita) {
        const textoReceita = normalizarTexto([receita.nome || "", receita.categoria || "", receita.ingredientes || ""].join(" "));

        const nomeValido = textoReceita.includes(textoPesquisado);

        const categoriaValida = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(receita.categoria);

        const tempoValido = verificarTempoReceita(receita.tempoPreparo, temposSelecionados);

        let dificuldadeReceita = receita.dificuldade;

        if (!dificuldadeReceita || dificuldadeReceita === "Não informado") {
            dificuldadeReceita = "nao-informado";
        }

        const dificuldadeValida = dificuldadesSelecionadas.length === 0 ||
            dificuldadesSelecionadas.includes(dificuldadeReceita);

        return nomeValido && categoriaValida && tempoValido && dificuldadeValida;
    });

    const receitasOrdenadas = ordenarReceitas(receitasFiltradas);

    exibirReceitas(receitasOrdenadas);
}

botaoFiltrar.addEventListener("click", function () {
    aplicarFiltros();
});

function obterTemposSelecionados() {
    const temposSelecionados = [];

    filtrosTempo.forEach(function (filtro) {
        if (filtro.checked) {
            temposSelecionados.push(filtro.value);
        }
    });

    return temposSelecionados;
}

function obterDificuldadesSelecionadas() {
    const dificuldadesSelecionadas = [];

    filtrosDificuldade.forEach(function (filtro) {
        if (filtro.checked) {
            dificuldadesSelecionadas.push(filtro.value);
        }
    });

    return dificuldadesSelecionadas;
}

function converterTempoMinutos(tempo) {

    if (tempo === "Não informado") {
        return Infinity;
    }

    if (typeof tempo === "number") {
        return tempo;
    }

    let totalMinutos = 0;

    if (tempo.includes("h")) {
        const partes = tempo.split("h");

        const horas = parseInt(partes[0]);
        totalMinutos += horas * 60;

        if (partes[1] !== "") {
            const minutos = parseInt(partes[1]);
            totalMinutos += minutos;
        }
    } else {
        totalMinutos = parseInt(tempo);
    }

    return totalMinutos;
}

function verificarTempoReceita(tempo, temposSelecionados) {

    if (temposSelecionados.length === 0) {
        return true;
    }

    if (!tempo || tempo === "Não informado") {
        return temposSelecionados.includes("nao-informado");
    }

    const minutos = converterTempoMinutos(tempo);

    if (!Number.isFinite(minutos)) {
        return temposSelecionados.includes("nao-informado");
    }

    if (temposSelecionados.includes("ate-30") && minutos <= 30) {
        return true;
    }

    if (temposSelecionados.includes("30-60") && minutos > 30 && minutos <= 60) {
        return true;
    }

    if (temposSelecionados.includes("60-120") && minutos > 60 && minutos <= 120) {
        return true;
    }

    if (temposSelecionados.includes("mais-120") && minutos > 120) {
        return true;
    }

    return false;
}

filtrosCategoria.forEach(function (filtro) {
    filtro.addEventListener("change", function () {
        if (filtro.value === "todas" && filtro.checked) {
            filtrosCategoria.forEach(function (categoria) {
                if (categoria.value !== "todas") {
                    categoria.checked = false;
                }
            });
        } else if (filtro.value !== "todas" && filtro.checked) {
            filtroTodas.checked = false;
        }
    });
});

function limparFiltros() {
    filtrosCategoria.forEach(function (filtro) {
        filtro.checked = false;
    });

    filtrosTempo.forEach(function (filtro) {
        filtro.checked = false
    });

    filtrosDificuldade.forEach(function (filtro) {
        filtro.checked = false;
    });

    campoPesquisa.value = "";

    aplicarFiltros();
}

botaoLimparFiltros.addEventListener("click", function () {
    limparFiltros();
});

campoOrdenacao.addEventListener("change", function () {
    aplicarFiltros();
});

if (pesquisaInicial !== null) {
    campoPesquisa.value = pesquisaInicial;
}

if (categoriaInicial !== null) {
    filtrosCategoria.forEach(function(filtro) {
        if (filtro.value === categoriaInicial) {
            filtro.checked = true;
        }
    });
}

registrarDatasCatalogo(receitas);

idsAleatorios = embaralharReceitas(receitas).map(function(receita) {
    return String(receita.id);
});

aplicarFiltros();

function embaralharReceitas(listaReceitas) {
    const receitasEmbaralhadas = listaReceitas.slice();

    for (let i = receitasEmbaralhadas.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(Math.random() * (i + 1));

        const temporaria = receitasEmbaralhadas[i];

        receitasEmbaralhadas[i] = receitasEmbaralhadas[indiceAleatorio];
        receitasEmbaralhadas[indiceAleatorio] = temporaria;
    }

    return receitasEmbaralhadas;
}

async function carregarReceitasExternas() {
    const resultados = await Promise.allSettled([
        buscarReceitasAPI(),
        buscarReceitasSpoonacular("")
    ]);

    const receitasTheMealDB = resultados[0].status === "fulfilled" ? resultados[0].value : [];

    const receitasSpoonacular = resultados[1].status === "fulfilled" ? resultados[1].value : [];

    const receitasExternas = receitasTheMealDB.concat(receitasSpoonacular);

    const receitasNovas = receitasExternas.filter(function(receitaExterna) {
        if (receitaEstaOculta(receitaExterna.id)) {
            return false;
        }

        return !receitas.some(function(receitaLocal) {
            return String(receitaLocal.id) === String(receitaExterna.id);
        });
    });
    registrarDatasCatalogo(receitasNovas);

    receitas = receitas.concat(receitasNovas);

    idsAleatorios = embaralharReceitas(receitas).map(function(receita) {
        return String(receita.id);
    });

    aplicarFiltros();
}

const botoesVisualizacao = document.querySelectorAll(".visualizacao-receitas button");
const botaoGrade = botoesVisualizacao[0];
const botaoLista = botoesVisualizacao[1];

function alterarVisualizacao(tipo) {
    gradeReceitas.classList.toggle("visualizacao-lista", tipo === "lista");

    botaoGrade.classList.toggle("visualizacao-selecionada", tipo === "grade");
    botaoLista.classList.toggle("visualizacao-selecionada", tipo === "lista");

    botaoGrade.setAttribute("aria-pressed", tipo === "grade");
    botaoLista.setAttribute("aria-pressed", tipo === "lista");
}

botaoGrade.addEventListener("click", function() {
    alterarVisualizacao("grade");
});

botaoLista.addEventListener("click", function() {
    alterarVisualizacao("lista");
});

alterarVisualizacao("grade");

carregarReceitasExternas();