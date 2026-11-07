async function buscarReceitasSpoonacular(pesquisa) {
    try {
        const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

        if (pesquisa.trim() !== "") {
            url.searchParams.set("query", pesquisa);
        } else {
            url.searchParams.set("sort", "random");
        }

        url.searchParams.set("number", "8");
        url.searchParams.set("addRecipeInformation", "true");
        url.searchParams.set("apiKey", CHAVE_SPOONACULAR);

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        const receitas = dados.results || [];

        return receitas.map(adaptarReceitaSpoonacular);

    } catch (erro) {
        console.error("Erro ao buscar receitas na Spoonacular:", erro.message);

        return [];
    }
}

function adaptarCategoriaSpoonacular(receita) {
    const tipos = receita.dishTypes || [];
    const titulo = (receita.title || "").toLowerCase();

    if (tipos.includes("dessert")) return "sobremesas";
    if (tipos.includes("soup")) return "sopas";
    if (tipos.includes("salad")) return "saladas";

    if (tipos.includes("breakfast") || tipos.includes("brunch")) {
        return "café da manhã";
    }

    if (titulo.includes("pasta") ||
        titulo.includes("spaghetti") ||
        titulo.includes("lasagna")) {
        return "massas";
    }

    if (titulo.includes("shrimp") ||
        titulo.includes("salmon") ||
        titulo.includes("fish")) {
        return "frutos do mar";
    }

    if (receita.vegetarian || receita.vegan) {
        return "vegetarianas";
    }

    if (titulo.includes("chicken") ||
        titulo.includes("beef") ||
        titulo.includes("pork")) {
        return "carnes";
    }

    if (tipos.includes("snack") || tipos.includes("appetizer")) {
        return "lanches";
    }

    return "outras";
}

function adaptarReceitaSpoonacular(receita) {
    let descricao = "";

    if (receita.summary) {
        const documento = new DOMParser().parseFromString(
            receita.summary,
            "text/html"
        );

        descricao = documento.body.textContent.trim();
    }

    return {
        id: "spoon-" + receita.id,
        origem: "spoonacular",
        nome: receita.title,
        categoria: adaptarCategoriaSpoonacular(receita),

        tempoPreparo: receita.readyInMinutes > 0
            ? receita.readyInMinutes
            : "Não informado",

        dificuldade: "Não informado",

        imagem: receita.image || "",
        descricao: descricao,

        rendimento: receita.servings > 0
            ? receita.servings + " porções"
            : "",

        culinaria: (receita.cuisines || []).join(", "),
        dietas: receita.diets || [],

        ingredientes: "",
        modoPreparo: ""
    };
}

async function buscarReceitaPorIdSpoonacular(idReceita) {
    try {
        const idSpoonacular = idReceita.slice(6);

        const url = new URL(
            "https://api.spoonacular.com/recipes/" + idSpoonacular + "/information"
        );

        url.searchParams.set("includeNutrition", "false");
        url.searchParams.set("apiKey", CHAVE_SPOONACULAR);

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        return adaptarDetalhesSpoonacular(dados);

    } catch (erro) {
        console.error("Erro ao buscar detalhes na Spoonacular:", erro.message);

        return null;
    }
}

function adaptarDetalhesSpoonacular(receita) {
    const receitaAdaptada = adaptarReceitaSpoonacular(receita);

    const ingredientes = (receita.extendedIngredients || []).map(function(ingrediente) {
        return ingrediente.original || ingrediente.name || "";
    });

    receitaAdaptada.ingredientes = ingredientes.join("\n");

    const etapas = [];

    (receita.analyzedInstructions || []).forEach(function(bloco) {
        (bloco.steps || []).forEach(function(etapa) {
            if (etapa.step) {
                etapas.push(etapa.step);
            }
        });
    });

    receitaAdaptada.modoPreparo = etapas.join("\n");

    if (!receitaAdaptada.modoPreparo && receita.instructions) {
        const documento = new DOMParser().parseFromString(
            receita.instructions,
            "text/html"
        );

        receitaAdaptada.modoPreparo = documento.body.textContent.trim();
    }

    return receitaAdaptada;
}