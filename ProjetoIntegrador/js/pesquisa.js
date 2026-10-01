const produtos = [
    {
        nome: "Vela Aromática",
        id: "vela-aromatica"
    },
    {
        nome: "Cesta Boho",
        id: "cesta-boho"
    },
    {
        nome: "Bolsa de Crochê",
        id: "bolsa-croche"
    },
    {
        nome: "Kit Cozy",
        id: "kit-cozy"
    },
    {
        nome: "Sabonete Artesanal",
        id: "sabonete-artesanal"
    },
    {
        nome: "Porta-Velas",
        id: "porta-velas"
    },
    {
        nome: "Vaso Decorativo",
        id: "vaso-decorativo"
    },
    {
        nome: "Kit Presente",
        id: "kit-presente"
    }
];


function pesquisarProdutos() {

    let campoPesquisa = document.getElementById("pesquisa");
    let resultado = document.getElementById("resultadoPesquisa");

    let texto = campoPesquisa.value.toLowerCase().trim();

    resultado.innerHTML = "";

    // Se não tiver nada digitado
    if (texto === "") {
        resultado.style.display = "none";
        return;
    }

    // Procura os produtos
    let encontrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
    );


    // Se encontrou produtos
    if (encontrados.length > 0) {

        encontrados.forEach(produto => {

            resultado.innerHTML += `
                <a href="produtos.html#${produto.id}">
                    ${produto.nome}
                </a>
            `;

        });

    }

    // Se NÃO encontrou
    else {

        resultado.innerHTML = `
            <div class="sem-resultado">
                Nenhum produto encontrado.<br>
                Tente pesquisar novamente.
            </div>
        `;

    }


    resultado.style.display = "block";
}