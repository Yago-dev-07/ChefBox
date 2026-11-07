function carregarFavoritos() {
    const favoritosSalvos = localStorage.getItem("chefbox_favoritos");

    if (favoritosSalvos === null) {
        return [];
    }

    return JSON.parse(favoritosSalvos);
}
function salvarFavoritos(favoritos) {
    localStorage.setItem("chefbox_favoritos", JSON.stringify(favoritos));
}

function verificarFavorito(idReceita) {
    const favoritos = carregarFavoritos();
    
    return favoritos.includes(idReceita);
}

function alternarFavorito(idReceita) {
    const favoritos = carregarFavoritos();

    if (favoritos.includes(idReceita)) {
        const posicao = favoritos.indexOf(idReceita);
        favoritos.splice(posicao, 1);
    } else {
        favoritos.push(idReceita);
    }

    salvarFavoritos(favoritos);
}

async function carregarReceitasFavoritasComAPI() {
    const idsFavoritos = carregarFavoritos();
    const receitasLocais = carregarReceitas();
    const receitasFavoritas = await Promise.all(idsFavoritos.map(async function(id) {
    
        const idTexto = String(id);

        const ehReceitaExterna = idTexto.startsWith("api-") || idTexto.startsWith("spoon-");

        if (ehReceitaExterna && receitaEstaOculta(idTexto)) {
            return null;
        }

        const receitaLocal = receitasLocais.find(function(receita) {
            return String(receita.id) === idTexto;
        });

        if (receitaLocal) {
            return receitaLocal;
        }

        if (idTexto.startsWith("api-")) {
            return await buscarReceitaPorIdAPI(idTexto);
        }

        if (idTexto.startsWith("spoon-")) {
            return await buscarReceitaPorIdSpoonacular(idTexto);
        }

        return null;
    }));

    return receitasFavoritas.filter(function(receita) {
        return receita !== null;
    });
}