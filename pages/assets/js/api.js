function montarIngredientes(receita) {
    const ingredientes = [];

    for (let i = 1; i <= 20; i++) {
        const ingrediente = receita["strIngredient" + i];
        const medida = receita["strMeasure" + i];

        if (ingrediente && ingrediente.trim() !== "") {
            let texto = ingrediente.trim();

            if (medida && medida.trim() !== "") {
                texto = medida.trim() + " " + texto;
            }

            ingredientes.push(texto);
        }
    }

    return ingredientes.join("\n");
}

function adaptarCategoriaTheMealDB(categoria) {
    const categorias = {
        Beef: "carnes",
        Chicken: "carnes",
        Lamb: "carnes",
        Pork: "carnes",
        Goat: "carnes",
        Seafood: "frutos do mar",
        Pasta: "massas",
        Vegetarian: "vegetarianas",
        Vegan: "vegetarianas",
        Soup: "sopas",
        Dessert: "sobremesas",
        Starter: "lanches",
        Breakfast: "café da manhã"
    };

    return categorias[categoria] || "outras";
}

function adaptarReceitaAPI(receita) {
    return {
        id: "api-" + receita.idMeal,
        origem: "api",
        nome: receita.strMeal,
        categoria: adaptarCategoriaTheMealDB(receita.strCategory),
        tempoPreparo: "Não informado",
        dificuldade: "Não informado",
        imagem: receita.strMealThumb,
        descricao: "",
        rendimento: "",
        ingredientes: montarIngredientes(receita),
        modoPreparo: receita.strInstructions
    };
}

async function buscarReceitasAPI() {
    const pesquisas = [
        "chicken",
        "beef",
        "pasta",
        "soup",
        "cake",
        "fish",
        "salad"
    ];

    const consultas = pesquisas.map(async function(pesquisa) {
        try {
            const url = "https://www.themealdb.com/api/json/v1/1/search.php?s="
                + encodeURIComponent(pesquisa);

            const resposta = await fetch(url);

            if (!resposta.ok) {
                throw new Error("Erro HTTP: " + resposta.status);
            }

            const dados = await resposta.json();

            return dados.meals || [];

        } catch (erro) {
            console.error("Erro ao buscar " + pesquisa + ":", erro.message);
            return [];
        }
    });

    const resultados = await Promise.all(consultas);

    const receitasUnicas = [];
    const idsEncontrados = new Set();

    resultados.forEach(function(grupo) {
        grupo.forEach(function(receita) {
            if (!idsEncontrados.has(receita.idMeal)) {
                idsEncontrados.add(receita.idMeal);

                receitasUnicas.push(adaptarReceitaAPI(receita));
            }
        });
    });

    return receitasUnicas;
}

async function buscarReceitaPorIdAPI(idReceita) {
    try {
        const idAPI = idReceita.slice(4);

        const resposta = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + idAPI);

        if(!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        if (dados.meals === null || dados.meals.length === 0) {
            return null;
        }

        return adaptarReceitaAPI(dados.meals[0]);
    } catch (erro) {
        console.error("Erro ao buscar receita:", erro.message);
        return null;
    }
}
