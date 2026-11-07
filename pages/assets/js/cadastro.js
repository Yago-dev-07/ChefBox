const nome = document.getElementById("nome-receita");
const descricao = document.getElementById("descricao");
const imagem = document.getElementById("imagem-receita");
const categoria = document.getElementById("categoria");
const tempoPreparo = document.getElementById("tempo-preparo");
const dificuldade = document.getElementById("dificuldade");
const rendimento = document.getElementById("rendimento");
const ingredientes = document.getElementById("ingredientes");
const modoPreparo = document.getElementById("modo-preparo");
const mensagemCadastro = document.getElementById("mensagem-cadastro");
const mensagemImagem = document.getElementById("mensagem-imagem");
const formulario = document.getElementById("form-cadastro");
const parametros = new URLSearchParams(window.location.search);
const idReceita = parametros.get("id");
const receitas = carregarReceitas();
const subtituloFormulario = document.getElementById("subtitulo-formulario");
const tituloFormulario = document.getElementById("titulo-formulario");
const descricaoFormulario = document.getElementById("descricao-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const imagemAtual = document.getElementById("imagem-atual");
const visualizacaoImagem = document.getElementById("visualizacao-imagem");
const areaUpload = document.querySelector(".area-upload");
const nomeArquivo = document.getElementById("nome-arquivo");

let receitaEditada = null;

if (idReceita !== null) {
    receitaEditada = receitas.find(function(receita) {
        return String(receita.id) === idReceita;
    });
}

function exibirMensagem(texto, tipo) {
    mensagemCadastro.innerHTML = "";

    mensagemCadastro.classList.remove("mensagem-erro", "mensagem-sucesso");

    const icone = document.createElement("i");
    if (tipo === "erro") {
        mensagemCadastro.classList.add("mensagem-erro");
        icone.classList.add("fa-solid", "fa-circle-exclamation");
    } else {
        mensagemCadastro.classList.add("mensagem-sucesso");
        icone.classList.add("fa-solid", "fa-circle-check");
    }

    mensagemCadastro.appendChild(icone);
    mensagemCadastro.append(" " + texto);
}

function exibirErro(campo, texto) {
    campo.classList.add("campo-invalido");

    const container = campo.closest(".campo-cadastro");

    if (!container.querySelector(".icone-erro")) {
        const icone = document.createElement("i");
        icone.classList.add("fa-solid", "fa-circle-exclamation", "icone-erro");
    
        container.appendChild(icone);
    }

    exibirMensagem(texto, "erro");
}

function exibirErroImagem(texto) {
    mensagemImagem.innerHTML = "";

    const icone = document.createElement("i");
    icone.classList.add("fa-solid", "fa-circle-exclamation");

    mensagemImagem.appendChild(icone);
    mensagemImagem.append(" " + texto);

    imagem.classList.add("campo-invalido");
    document.querySelector(".area-upload").classList.add("campo-invalido");
}

const campos = [nome, descricao, imagem, categoria, tempoPreparo, dificuldade, rendimento, ingredientes, modoPreparo];

campos.forEach(function(campo) {
    campo.addEventListener("focus", function() {
        campo.classList.remove("campo-invalido");

        const container = campo.closest(".campo-cadastro");
        const icone = container.querySelector(".icone-erro");

        if (icone) {
            icone.remove();
        }

        if (campo === imagem) {
            document.querySelector(".area-upload").classList.remove("campo-invalido");
        }
    });
});

imagem.addEventListener("change", function() {
    mensagemImagem.innerHTML = "";

    imagem.classList.remove("campo-invalido");
    areaUpload.classList.remove("campo-invalido");

    const arquivo = imagem.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        exibirErroImagem("Selecione um arquivo de imagem válido.");
        return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
        exibirErroImagem("A imagem deve ter no máximo 5 MB.");
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function() {
        visualizacaoImagem.src = leitor.result;
        visualizacaoImagem.alt = arquivo.name;

        nomeArquivo.textContent = arquivo.name;

        imagemAtual.hidden = false;
        areaUpload.classList.add("com-imagem");
    };

    leitor.onerror = function() {
        exibirErroImagem("Não foi possível visualizar a imagem.");
    };

    leitor.readAsDataURL(arquivo);
});

function finalizarSalvamento(receitaSalva) {
    if (receitaEditada) {
        const indice = receitas.findIndex(function(receita) {
            return String(receita.id) === String(receitaSalva.id);
        });

        if (indice === -1) {
            receitas.push(receitaSalva);
        } else {
            receitas[indice] = receitaSalva;
        }

        salvarReceitas(receitas);

        window.location.href = "receita.html?id=" + receitaSalva.id;
    } else {
        receitas.push(receitaSalva);
        salvarReceitas(receitas);

        exibirMensagem("Receita cadastrada com sucesso!", "sucesso");

        formulario.reset();
    }
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (idReceita !== null && !receitaEditada) {
        return;
    }

    const nomeDigitado = nome.value.trim();
    const descricaoDigitada = descricao.value.trim();
    const categoriaSelecionada = categoria.value;
    const tempoDigitado = tempoPreparo.value.trim();
    const dificuldadeSelecionada = dificuldade.value;
    const rendimentoDigitado = rendimento.value.trim();
    const ingredientesDigitados = ingredientes.value.trim();
    const modoPreparoDigitado = modoPreparo.value.trim();
    const imagemSelecionada = imagem.files[0];

    let formularioValido = true;

    const camposOpcionais = [];

    if (receitaEditada) {
        camposOpcionais.push(imagem);
    }

    if (receitaEditada && (receitaEditada.origem === "api" || receitaEditada.origem === "spoonacular" || receitaEditada.origem === "perosnalizada")) {
        camposOpcionais.push(descricao, tempoPreparo, dificuldade, rendimento);
    }

        campos.forEach(function(campo) {
            let valor;

            if (campo.type === "file") {
                valor = campo.files.length;
            } else {
                valor = campo.value.trim();
            }

            if (!valor && !camposOpcionais.includes(campo)) {
                campo.classList.add("campo-invalido");
                const container = campo.closest(".campo-cadastro");

                if (!container.querySelector(".icone-erro")) {
                    const icone = document.createElement("i");
                    icone.classList.add("fa-solid", "fa-circle-exclamation", "icone-erro");

                    container.appendChild(icone);
                }

                if (campo === imagem) {
                    document.querySelector(".area-upload").classList.add("campo-invalido");
                }

                formularioValido = false;
            }
        });

        if (!formularioValido) {
            exibirMensagem("Preencha os campos obrigatórios.", "erro");
            return;
        }

    if (nomeDigitado.length < 3) {
        exibirErro(nome, "O nome da receita deve ter pelo menos 3 caracteres.")
        return;
    }
    
    let receitaSalva;

    if (receitaEditada) {
        receitaSalva = receitaEditada;
    } else {
        receitaSalva = {
            id: crypto.randomUUID(),
            imagem: "",
            dataCadastro: new Date().toISOString()
        };
    }

    receitaSalva.nome = nomeDigitado;
    receitaSalva.descricao = descricaoDigitada;
    receitaSalva.categoria = categoriaSelecionada;
    receitaSalva.tempoPreparo = tempoDigitado;
    receitaSalva.dificuldade = dificuldadeSelecionada;
    receitaSalva.rendimento = rendimentoDigitado;
    receitaSalva.ingredientes = ingredientesDigitados;
    receitaSalva.modoPreparo = modoPreparoDigitado;

    if (receitaSalva.origem === "api" || receitaSalva.origem === "spoonacular") {
        if (receitaSalva.origem === "spoonacular") {
            receitaSalva.fonte = "spoonacular";
        }

        receitaSalva.origem = "personalizada";
    }

    if (!tempoDigitado) {
        receitaSalva.tempoPreparo = "Não informado";
    }

    if (!dificuldadeSelecionada) {
        receitaSalva.dificuldade = "Não informado";
    }

    if (imagemSelecionada) {
        if (!imagemSelecionada.type.startsWith("image/")) {
            exibirErroImagem("Selecione um arquivo de imagem válido.");
            return;
        }

        if (imagemSelecionada.size > 5 * 1024 * 1024) {
            exibirErroImagem("A imagem deve ter no máximo 5 MB.");
            return;
        }
    }

    if (imagemSelecionada) { 
        const leitor = new FileReader(); 

        leitor.onload = function() {
            receitaSalva.imagem = leitor.result;
            receitaSalva.nomeImagem = imagemSelecionada.name;
            finalizarSalvamento(receitaSalva);
        };

        leitor.onerror = function() {
            exibirErroImagem("Não foi possível ler a imagem selecionada.");
        };

        leitor.readAsDataURL(imagemSelecionada);
    } else {
        finalizarSalvamento(receitaSalva);
    }
});

function preencherFormulario() {
    nome.value = receitaEditada.nome;
    descricao.value = receitaEditada.descricao;
    categoria.value = receitaEditada.categoria;
    dificuldade.value = receitaEditada.dificuldade;
    rendimento.value = receitaEditada.rendimento;
    ingredientes.value = receitaEditada.ingredientes;
    modoPreparo.value = receitaEditada.modoPreparo;

    let tempo = receitaEditada.tempoPreparo;

    if (tempo === "Não informado") {
        tempo = "";
    }

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

    tempoPreparo.value = tempo;
}

function exibirImagemAtual () {
    if (receitaEditada.imagem.startsWith("data:") || receitaEditada.imagem.startsWith("http")) {
        visualizacaoImagem.src = receitaEditada.imagem;
    } else {
        visualizacaoImagem.src = "assets/img/" + receitaEditada.imagem;
    }

    visualizacaoImagem.alt = receitaEditada.nome;
    imagemAtual.hidden = false;

    nomeArquivo.textContent = receitaEditada.nomeImagem || "Imagem atual da receita";
    areaUpload.classList.add("com-imagem");
} 

function prepararEdicao() {
    document.title = "Editar receita - Chefbox";

    subtituloFormulario.textContent = "EDITAR RECEITA";
    tituloFormulario.textContent = "Edite sua receita";
    descricaoFormulario.textContent = "Atualize as informações da receita nos campos abaixo."

    botaoSalvar.innerHTML = "";

    const icone = document.createElement("i");
    icone.classList.add("fa-solid", "fa-check");

    botaoSalvar.appendChild(icone);
    botaoSalvar.append(" Salvar alterações");

    imagem.required = false;

    if (receitaEditada.origem === "api" || receitaEditada.origem === "spoonacular" || receitaEditada.origem === "personalizada") {
        descricao.required = false;
        tempoPreparo.required = false;
        dificuldade.required = false;
        rendimento.required = false;
    }

    preencherFormulario();
    exibirImagemAtual();
}

async function iniciarEdicao() {
    if (idReceita === null) {
        return;
    }

    const ehReceitaExterna = idReceita.startsWith("api-") || idReceita.startsWith("spoon-");

    if (ehReceitaExterna && receitaEstaOculta(idReceita)) {
        receitaEditada = null;

    } else if (!receitaEditada && idReceita.startsWith("api-")) {
        receitaEditada = await buscarReceitaPorIdAPI(idReceita);

    } else if (!receitaEditada && idReceita.startsWith("spoon-")) {
        receitaEditada = await buscarReceitaPorIdSpoonacular(idReceita);
    }
    
    if (receitaEditada) {
        prepararEdicao();
    } else {
        exibirMensagem("A receita que você deseja editar não foi encontrada.", "erro");

        const secoesFormulario = formulario.querySelectorAll(
            ".linha-principal-cadastro, .linha-informacoes-cadastro, .linha-preparo-cadastro, .acoes-cadastro"
        );

        secoesFormulario.forEach(function(secao) {
            secao.hidden = true;
        });
    }
}

iniciarEdicao();

formulario.addEventListener("reset", function() {
    imagemAtual.hidden = true;
    areaUpload.classList.remove("com-imagem");

    visualizacaoImagem.removeAttribute("src");
    nomeArquivo.textContent = "";
});