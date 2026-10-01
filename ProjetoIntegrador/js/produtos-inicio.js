// ============================================
// PRODUTOS DA PÁGINA INICIAL
// ============================================

async function carregarProdutosInicio() {

    const container = document.getElementById("produtosInicio");

    if (!container) return;

    try {

        const resposta = await fetch("../php/listar_produtos.php");

        const resultado = await resposta.json();

        if (!resultado.sucesso) {

            container.innerHTML = `
                <p>Não foi possível carregar os produtos.</p>
            `;

            return;
        }

        const produtos = resultado.produtos || [];

        container.innerHTML = "";

        if (produtos.length === 0) {

            container.innerHTML = `
                <p>Nenhum produto cadastrado.</p>
            `;

            return;
        }

        produtos.forEach(function(produto) {

            const imagem =
                produto.imagem || "../img/logo.png";

            container.innerHTML += `

                <div class="produto-card">

                    <div class="produto-imagens">

                        <img
                            src="${imagem}"
                            alt="${produto.nome}"
                            onerror="this.src='../img/logo.png'"
                        >

                    </div>

                    <h3>${produto.nome}</h3>

                    <p>
                        ${produto.descricao || "Produto artesanal da Lunary."}
                    </p>

                    <span>
                        R$ ${Number(produto.preco)
                            .toFixed(2)
                            .replace(".", ",")}
                    </span>

                    <button
                        onclick="adicionarCarrinho(
                            '${produto.nome.replace(/'/g, "\\'")}',
                            ${Number(produto.preco)},
                            '${imagem}'
                        )">

                        Adicionar ao Carrinho

                    </button>

                </div>

            `;

        });

    } catch (erro) {

        console.error("Erro ao carregar produtos:", erro);

        container.innerHTML = `
            <p>
                Erro ao conectar com o servidor.
            </p>
        `;
    }
}


// Inicia quando a página carregar
document.addEventListener("DOMContentLoaded", function() {

    carregarProdutosInicio();

});