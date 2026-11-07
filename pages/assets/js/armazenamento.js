const CHAVE_RECEITAS = "chefbox_receitas";

function salvarReceitas(receitas) {
    localStorage.setItem(CHAVE_RECEITAS, JSON.stringify(receitas));
}

function carregarReceitas() {
    const receitasSalvas = localStorage.getItem(CHAVE_RECEITAS);

    if (receitasSalvas === null) {
        salvarReceitas(receitasIniciais);
        return receitasIniciais;
    }

    return JSON.parse(receitasSalvas);
}

const CHAVE_RECEITAS_OCULTAS = "chefbox_receitas_ocultas";

function carregarReceitasOcultas() {
    const receitasOcultas = localStorage.getItem(CHAVE_RECEITAS_OCULTAS);

    if (receitasOcultas === null) {
        return [];
    }

    return JSON.parse(receitasOcultas);
}

function receitaEstaOculta(idReceita) {
    const receitasOcultas = carregarReceitasOcultas();

    return receitasOcultas.includes(String(idReceita));
}

function ocultarReceitaAPI(idReceita) {
    const receitasOcultas = carregarReceitasOcultas();

    if (!receitasOcultas.includes(String(idReceita))) {
        receitasOcultas.push(String(idReceita));

        localStorage.setItem(
            CHAVE_RECEITAS_OCULTAS,
            JSON.stringify(receitasOcultas)
        );
    }
}