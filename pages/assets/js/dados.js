
const receitasIniciais = [
    {
        id: 1,
        nome: "Lasanha à Bolonhesa",
        categoria: "massas",
        tempoPreparo: 90,
        dificuldade: "medio",
        imagem: "card-lasanha.png",
        descricao: "Uma deliciosa lasanha à bolonhesa, perfeita para reunir a família e aproveitar uma refeição especial.",
        rendimento: "6 porções",
        ingredientes: "Massa para lasanha\nCarne moída\nMolho de tomate\nCebola\nAlho\nQueijo mussarela\nPresunto\nQueijo parmesão",
        modoPreparo: "Prepare o molho à bolonhesa.\nCozinhe a massa conforme as instruções da embalagem.\nMonte a lasanha intercalando massa, molho, presunto e queijo.\nFinalize com queijo parmesão.\nLeve ao forno até gratinar e sirva."
    },
    {
        id: 2,
        nome: "Macarrão à Carbonara",
        categoria: "massas",
        tempoPreparo: 30,
        dificuldade: "facil",
        imagem: "card-carbonara.png",
        descricao: "Um clássico da culinária italiana, preparado com massa, ovos, queijo e bacon, resultando em um prato cremoso e cheio de sabor.",
        rendimento: "4 porções",
        ingredientes: "400 g de espaguete\n200 g de bacon\n3 ovos\n100 g de queijo parmesão ralado\nSal a gosto\nPimenta-do-reino a gosto",
        modoPreparo: "Cozinhe o espaguete em água fervente com sal até ficar al dente.\nCorte o bacon em cubos e frite em uma frigideira até dourar.\nEm uma tigela, misture os ovos, o queijo parmesão e a pimenta-do-reino.\nEscorra o macarrão, reservando um pouco da água do cozimento.\nCom o fogo desligado, misture o macarrão ao bacon e acrescente a mistura de ovos, mexendo rapidamente.\nAdicione um pouco da água reservada, se necessário, até obter um molho cremoso e sirva."
    },
    {
        id: 3,
        nome: "Frango grelhado com legumes",
        categoria: "carnes",
        tempoPreparo: 45,
        dificuldade: "medio",
        imagem: "card-frango.png",
        descricao: "Uma refeição saborosa e equilibrada, combinando filé de frango grelhado com legumes frescos e temperos especiais.",
        rendimento: "4 porções",
        ingredientes: "4 filés de peito de frango\n2 cenouras\n1 abobrinha\n1 brócolis pequeno\n2 dentes de alho\n2 colheres de sopa de azeite\nSuco de 1 limão\nSal a gosto\nPimenta-do-reino a gosto",
        modoPreparo: "Tempere os filés de frango com alho, limão, sal e pimenta-do-reino.\nLave e corte as cenouras, a abobrinha e o brócolis em pedaços.\nCozinhe os legumes no vapor até ficarem macios, mas ainda firmes.\nAqueça uma frigideira com um pouco de azeite.\nGrelhe os filés de frango dos dois lados até ficarem dourados e completamente cozidos.\nTempere os legumes com azeite e sal e sirva acompanhando o frango."
    },
    {
        id: 4,
        nome: "Sopa de legumes",
        categoria: "sopas",
        tempoPreparo: 40,
        dificuldade: "facil",
        imagem: "card-sopas.png",
        descricao: "Uma sopa caseira, leve e nutritiva, preparada com legumes variados e ideal para os dias mais frios.",
        rendimento: "6 porções",
        ingredientes: "2 batatas\n2 cenouras\n1 abobrinha\n1 chuchu\n1 cebola\n2 dentes de alho\n1 colher de sopa de azeite\n1,5 litro de água\nSal a gosto\nCheiro-verde a gosto",
        modoPreparo: "Descasque e corte as batatas, as cenouras e o chuchu em cubos.\nCorte a abobrinha e pique a cebola e o alho.\nAqueça o azeite em uma panela e refogue a cebola e o alho.\nAcrescente os legumes e misture bem.\nAdicione a água e tempere com sal.\nCozinhe até que todos os legumes estejam macios.\nFinalize com cheiro-verde e sirva a sopa quente."
    },
    {
        id: 5,
        nome: "Bolo de chocolate",
        categoria: "sobremesas",
        tempoPreparo: 60,
        dificuldade: "medio",
        imagem: "card-bolo.png",
        descricao: "Um bolo de chocolate fofinho e saboroso, perfeito para acompanhar um café ou servir como sobremesa em ocasiões especiais.",
        rendimento: "10 porções",
        ingredientes: "3 ovos\n2 xícaras de farinha de trigo\n1 xícara de açúcar\n1 xícara de chocolate em pó\n1 xícara de leite\n1/2 xícara de óleo\n1 colher de sopa de fermento em pó\nManteiga e farinha para untar a forma",
        modoPreparo: "Preaqueça o forno a 180°C.\nEm uma tigela, misture os ovos, o açúcar e o óleo.\nAcrescente o leite e o chocolate em pó e misture bem.\nAdicione a farinha de trigo aos poucos, mexendo até obter uma massa homogênea.\nIncorpore delicadamente o fermento em pó.\nDespeje a massa em uma forma untada e enfarinhada.\nLeve ao forno por aproximadamente 35 a 40 minutos ou até que um palito inserido no centro saia limpo.\nEspere amornar antes de desenformar e servir."
    },
    {
        id: 6,
        nome: "Salada de grão-de-bico",
        categoria: "vegetarianas",
        tempoPreparo: 20,
        dificuldade: "facil",
        imagem: "card-salada.png",
        descricao: "Uma salada refrescante e nutritiva, preparada com grão-de-bico, vegetais frescos e um tempero leve de limão e azeite.",
        rendimento: "4 porções",
        ingredientes: "2 xícaras de grão-de-bico cozido\n1 tomate\n1 pepino\n1/2 cebola roxa\nSuco de 1 limão\n2 colheres de sopa de azeite\nSal a gosto\nSalsinha a gosto",
        modoPreparo: "Escorra o grão-de-bico já cozido e coloque em uma tigela.\nLave e corte o tomate e o pepino em cubos.\nPique a cebola roxa e a salsinha.\nMisture todos os ingredientes na tigela.\nTempere com suco de limão, azeite e sal.\nMisture delicadamente e sirva a salada fresca."
    },
    {
        id: 7,
        nome: "Hambúrguer caseiro",
        categoria: "lanches",
        tempoPreparo: 30,
        dificuldade: "medio",
        imagem: "card-hamburguer.png",
        descricao: "Um hambúrguer caseiro suculento, preparado com carne temperada, queijo e vegetais frescos, ideal para um lanche especial.",
        rendimento: "4 porções",
        ingredientes: "600 g de carne moída\n4 pães de hambúrguer\n4 fatias de queijo\n4 folhas de alface\n1 tomate\n1 cebola\nSal a gosto\nPimenta-do-reino a gosto\nÓleo para grelhar\nMolho de sua preferência",
        modoPreparo: "Divida a carne moída em quatro porções e modele os hambúrgueres.\nTempere os dois lados com sal e pimenta-do-reino.\nAqueça uma frigideira com um pouco de óleo.\nGrelhe os hambúrgueres dos dois lados até atingirem o ponto de cozimento desejado, garantindo que a carne esteja bem cozida.\nColoque uma fatia de queijo sobre cada hambúrguer e deixe derreter.\nCorte os pães ao meio e aqueça levemente.\nMonte os hambúrgueres com carne, queijo, alface, tomate, cebola e molho.\nFeche os pães e sirva."
    },
    {
        id: 8,
        nome: "Camarão na manteiga",
        categoria: "carnes",
        tempoPreparo: 25,
        dificuldade: "facil",
        imagem: "card-camarao.png",
        descricao: "Uma receita prática e saborosa de camarões preparados na manteiga com alho, limão e temperos frescos.",
        rendimento: "4 porções",
        ingredientes: "500 g de camarões limpos\n2 colheres de sopa de manteiga\n3 dentes de alho\nSuco de 1/2 limão\nSal a gosto\nPimenta-do-reino a gosto\nSalsinha picada a gosto",
        modoPreparo: "Lave os camarões limpos e seque com papel-toalha.\nTempere com sal, pimenta-do-reino e suco de limão.\nDerreta a manteiga em uma frigideira em fogo médio.\nAcrescente o alho picado e refogue rapidamente.\nAdicione os camarões e cozinhe por alguns minutos de cada lado, até ficarem opacos e completamente cozidos.\nFinalize com salsinha picada e sirva imediatamente."
    }
];

