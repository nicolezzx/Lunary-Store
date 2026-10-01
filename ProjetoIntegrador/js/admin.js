// ============================================
// LUNARY - PAINEL ADMINISTRATIVO
// ============================================


// ============================================
// ENDEREÇOS DOS PHP
// ============================================

const URL_LISTAR = "../php/listar_produtos.php";
const URL_ADICIONAR = "../php/adicionar_produto.php";
const URL_EDITAR = "../php/editar_produto.php";
const URL_EXCLUIR = "../php/excluir_produto.php";

const URL_USUARIOS = "../php/admin_usuarios.php";
const URL_PEDIDOS = "../php/admin_pedidos.php";
const URL_AVALIACOES = "../php/admin_avaliacoes.php";
const URL_MENSAGENS = "../php/admin_mensagens.php";
const URL_CUPONS = "../php/listar_cupons.php";


// ============================================
// VARIÁVEIS
// ============================================

let produtos = [];
let usuarios = [];
let pedidos = [];
let avaliacoes = [];
let mensagens = [];
let cupons = [];


// ============================================
// TROCAR SEÇÕES
// ============================================

function mostrarSecao(id, elemento) {

    document.querySelectorAll(".secao-admin").forEach(function (secao) {
        secao.style.display = "none";
    });

    const secao = document.getElementById(id);

    if (secao) {
        secao.style.display = "block";
    }

    document.querySelectorAll(".menu-admin a").forEach(function (link) {
        link.classList.remove("ativo");
    });

    if (elemento) {
        elemento.classList.add("ativo");
    }


    // ================================
    // CARREGAR SEÇÃO
    // ================================

    if (id === "dashboard") {
        atualizarDashboard();
    }

    if (id === "produtos") {
        listarProdutos();
    }

    if (id === "usuarios") {
        listarUsuarios();
    }

    if (id === "pedidos") {
        listarPedidos();
    }

    if (id === "avaliacoes") {
        listarAvaliacoes();
    }

    if (id === "mensagens") {
        listarMensagens();
    }

    if (id === "cupons") {
        listarCupons();
    }
}


// ============================================
// PRODUTOS
// ============================================

function abrirFormularioProduto() {

    const formulario =
        document.getElementById("formularioProduto");

    if (!formulario) return;

    formulario.style.display = "block";

    const titulo =
        document.getElementById("tituloFormularioProduto");

    if (titulo) {
        titulo.textContent = "Novo produto";
    }

    limparFormulario();

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function fecharFormularioProduto() {

    const formulario =
        document.getElementById("formularioProduto");

    if (formulario) {
        formulario.style.display = "none";
    }

    limparFormulario();
}


function limparFormulario() {

    const campos = [
        "idProduto",
        "nomeProduto",
        "precoProduto",
        "categoriaProduto",
        "estoqueProduto",
        "imagemProduto",
        "descricaoProduto"
    ];

    campos.forEach(function (id) {

        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }

    });
}


// ============================================
// SALVAR PRODUTO
// ============================================

async function salvarProduto() {

    const id =
        document.getElementById("idProduto")?.value || "";

    const nome =
        document.getElementById("nomeProduto")?.value.trim() || "";

    const preco =
        document.getElementById("precoProduto")?.value || "";

    const categoria =
        document.getElementById("categoriaProduto")?.value.trim() || "";

    const estoque =
        document.getElementById("estoqueProduto")?.value || "";

    const imagem =
        document.getElementById("imagemProduto")?.value.trim() || "";

    const descricao =
        document.getElementById("descricaoProduto")?.value.trim() || "";


    if (!nome || !preco || !categoria || estoque === "") {

        alert(
            "Preencha nome, preço, categoria e estoque."
        );

        return;
    }


    const dados = {

        nome: nome,
        descricao: descricao,
        preco: Number(preco),
        imagem: imagem,
        categoria: categoria,
        estoque: Number(estoque)

    };


    try {

        let resposta;


        // EDITAR
        if (id) {

            dados.id = Number(id);

            resposta = await fetch(
                URL_EDITAR,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );

        }

        // ADICIONAR
        else {

            resposta = await fetch(
                URL_ADICIONAR,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );

        }


        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }


        const resultado =
            await resposta.json();


        if (resultado.sucesso) {

            alert(
                resultado.mensagem ||
                "Produto salvo com sucesso!"
            );

            fecharFormularioProduto();

            await listarProdutos();

            atualizarDashboard();

        } else {

            alert(
                resultado.mensagem ||
                "Não foi possível salvar o produto."
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao salvar produto:",
            erro
        );

        alert(
            "Erro ao conectar com o servidor.\n\n" +
            "Confira se o Apache e o MySQL estão ligados no XAMPP."
        );

    }
}


// ============================================
// LISTAR PRODUTOS
// ============================================

async function listarProdutos() {

    const lista =
        document.getElementById("listaProdutos");

    if (!lista) return;


    lista.innerHTML = `
        <p>Carregando produtos...</p>
    `;


    try {

        const resposta =
            await fetch(
                URL_LISTAR + "?t=" + Date.now()
            );


        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            lista.innerHTML = `
                <div class="produto-vazio">
                    <p>
                        ${resultado.mensagem ||
                        "Erro ao carregar produtos."}
                    </p>
                </div>
            `;

            return;
        }


        produtos =
            resultado.produtos || [];


        if (produtos.length === 0) {

            lista.innerHTML = `
                <div class="produto-vazio">
                    <p>Nenhum produto cadastrado.</p>
                </div>
            `;

            atualizarProdutosDestaque();

            return;
        }


        lista.innerHTML = "";


        produtos.forEach(function (produto) {

            const imagem =
                produto.imagem ||
                "../img/logo.png";


            lista.innerHTML += `

                <div class="produto-item">

                    <img
                        src="${imagem}"
                        alt="${produto.nome}"
                        onerror="this.src='../img/logo.png'"
                    >

                    <div class="produto-info">

                        <h3>
                            ${produto.nome}
                        </h3>

                        <p>
                            Categoria:
                            ${produto.categoria || "Não informada"}
                        </p>

                        <p>
                            Estoque:
                            ${produto.estoque}
                        </p>

                        <p>
                            ${produto.descricao || "Sem descrição"}
                        </p>

                    </div>

                    <div class="produto-preco">

                        R$ ${Number(produto.preco || 0)
                            .toFixed(2)
                            .replace(".", ",")}

                    </div>

                    <div class="acoes-produto">

                        <button
                            class="btn-editar"
                            onclick="editarProduto(${produto.id})"
                            title="Editar"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirProduto(${produto.id})"
                            title="Excluir"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            `;

        });


        atualizarProdutosDestaque();


    } catch (erro) {

        console.error(
            "Erro ao listar produtos:",
            erro
        );

        lista.innerHTML = `
            <div class="produto-vazio">

                <p>
                    Não foi possível carregar os produtos.
                </p>

                <small>
                    Verifique o XAMPP e o arquivo
                    listar_produtos.php.
                </small>

            </div>
        `;

    }
}


// ============================================
// EDITAR PRODUTO
// ============================================

function editarProduto(id) {

    const produto =
        produtos.find(function (item) {
            return Number(item.id) === Number(id);
        });


    if (!produto) {

        alert("Produto não encontrado.");

        return;
    }


    const formulario =
        document.getElementById("formularioProduto");

    if (formulario) {
        formulario.style.display = "block";
    }


    const titulo =
        document.getElementById("tituloFormularioProduto");

    if (titulo) {
        titulo.textContent = "Editar produto";
    }


    document.getElementById("idProduto").value =
        produto.id || "";

    document.getElementById("nomeProduto").value =
        produto.nome || "";

    document.getElementById("precoProduto").value =
        produto.preco || "";

    document.getElementById("categoriaProduto").value =
        produto.categoria || "";

    document.getElementById("estoqueProduto").value =
        produto.estoque || "";

    document.getElementById("imagemProduto").value =
        produto.imagem || "";

    document.getElementById("descricaoProduto").value =
        produto.descricao || "";


    if (formulario) {

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}


// ============================================
// EXCLUIR PRODUTO
// ============================================

async function excluirProduto(id) {

    const produto =
        produtos.find(function (item) {
            return Number(item.id) === Number(id);
        });


    if (!produto) {

        alert("Produto não encontrado.");

        return;
    }


    const confirmar =
        confirm(
            `Tem certeza que deseja excluir "${produto.nome}"?`
        );


    if (!confirmar) return;


    try {

        const resposta =
            await fetch(
                URL_EXCLUIR,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        id: Number(id)
                    })
                }
            );


        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }


        const resultado =
            await resposta.json();


        if (resultado.sucesso) {

            alert(
                resultado.mensagem ||
                "Produto excluído com sucesso!"
            );

            await listarProdutos();

            atualizarDashboard();

        } else {

            alert(
                resultado.mensagem ||
                "Não foi possível excluir o produto."
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );

        alert(
            "Erro ao conectar com o servidor."
        );

    }
}


// ============================================
// PRODUTOS EM DESTAQUE
// ============================================

function atualizarProdutosDestaque() {

    const area =
        document.getElementById("produtosDestaque");

    if (!area) return;


    if (produtos.length === 0) {

        area.innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        return;
    }


    area.innerHTML = "";


    produtos
        .slice(0, 4)
        .forEach(function (produto) {

            area.innerHTML += `

                <div class="produto-destaque">

                    <img
                        src="${produto.imagem || "../img/logo.png"}"
                        alt="${produto.nome}"
                        onerror="this.src='../img/logo.png'"
                    >

                    <div>

                        <h3>
                            ${produto.nome}
                        </h3>

                        <p>
                            Estoque:
                            ${produto.estoque}
                        </p>

                    </div>

                    <strong>
                        R$ ${Number(produto.preco || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                    </strong>

                </div>

            `;

        });
}


// ============================================
// USUÁRIOS
// ============================================

async function listarUsuarios() {

    const lista =
        document.getElementById("listaUsuarios");

    if (!lista) return;


    lista.innerHTML = `
        <p>Carregando usuários...</p>
    `;


    try {

        const resposta =
            await fetch(
                URL_USUARIOS + "?t=" + Date.now()
            );


        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            lista.innerHTML = `
                <div class="produto-vazio">
                    <p>
                        ${resultado.mensagem ||
                        "Erro ao carregar usuários."}
                    </p>
                </div>
            `;

            usuarios = [];

            atualizarTotalUsuarios();

            return;
        }


        usuarios =
            resultado.usuarios || [];


        mostrarUsuarios(usuarios);

        atualizarTotalUsuarios();


    } catch (erro) {

        console.error(
            "Erro ao listar usuários:",
            erro
        );

        lista.innerHTML = `
            <div class="produto-vazio">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Não foi possível carregar os usuários.
                </p>

            </div>
        `;

    }
}


// ============================================
// MOSTRAR USUÁRIOS
// ============================================

function mostrarUsuarios(listaUsuarios) {

    const lista =
        document.getElementById("listaUsuarios");

    if (!lista) return;


    if (!listaUsuarios || listaUsuarios.length === 0) {

        lista.innerHTML = `
            <div class="produto-vazio">

                <i class="fa-solid fa-users"></i>

                <p>
                    Nenhum usuário cadastrado.
                </p>

            </div>
        `;

        return;
    }


    lista.innerHTML = "";


    listaUsuarios.forEach(function (usuario) {

        lista.innerHTML += `

            <div class="usuario-admin">

                <div class="icone-usuario">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div class="informacoes-usuario">

                    <h3 class="nome-usuario">
                        ${usuario.nome || "Usuário"}
                    </h3>

                    <p class="email-usuario">
                        ${usuario.email || "E-mail não informado"}
                    </p>

                    <span class="tipo-usuario">
                        ${usuario.tipo || "cliente"}
                    </span>

                </div>

            </div>

        `;

    });
}


// ============================================
// PEDIDOS
// ============================================

async function listarPedidos() {

    const area =
        document.getElementById("todosPedidos");

    if (!area) return;


    area.innerHTML = `
        <div class="pedido-carregando">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>Carregando pedidos...</p>

        </div>
    `;


    try {

        const resposta =
            await fetch(
                URL_PEDIDOS + "?t=" + Date.now()
            );


        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            area.innerHTML = `
                <div class="pedido-vazio">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <h3>
                        Não foi possível carregar os pedidos
                    </h3>

                    <p>
                        ${resultado.mensagem || ""}
                    </p>

                </div>
            `;

            pedidos = [];

            atualizarTotalPedidos();

            return;
        }


        pedidos =
            resultado.pedidos || [];


        if (pedidos.length === 0) {

            area.innerHTML = `
                <div class="pedido-vazio">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <h3>
                        Nenhum pedido realizado
                    </h3>

                    <p>
                        Quando um cliente realizar uma compra,
                        o pedido aparecerá aqui.
                    </p>

                </div>
            `;

            atualizarTotalPedidos();

            atualizarPedidosRecentes([]);

            return;
        }


        area.innerHTML = "";


        pedidos.forEach(function (pedido) {

            const statusSalvo =
                localStorage.getItem(
                    "statusPedido_" + pedido.id
                ) || "Pendente";


            // ================================
            // ITENS
            // ================================

            let produtosHTML = "";


            if (
                pedido.itens &&
                pedido.itens.length > 0
            ) {

                pedido.itens.forEach(function (item) {

                    const preco =
                        Number(item.preco || 0)
                            .toFixed(2)
                            .replace(".", ",");


                    produtosHTML += `

                        <div class="item-do-pedido">

                            <div class="item-pedido-info">

                                <span class="quantidade-item">
                                    ${item.quantidade || 1}x
                                </span>

                                <span>
                                    ${item.nome || "Produto"}
                                </span>

                            </div>

                            <strong>
                                R$ ${preco}
                            </strong>

                        </div>

                    `;

                });

            } else {

                produtosHTML = `
                    <p class="sem-itens">
                        Informações dos produtos não disponíveis.
                    </p>
                `;

            }


            // ================================
            // DATA
            // ================================

            let dataFormatada =
                "Data não informada";


            if (pedido.data_pedido) {

                const data =
                    new Date(pedido.data_pedido);


                if (!isNaN(data.getTime())) {

                    dataFormatada =
                        data.toLocaleDateString("pt-BR") +
                        " às " +
                        data.toLocaleTimeString(
                            "pt-BR",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );

                }

            }


            // ================================
            // TOTAL
            // ================================

            const total =
                Number(pedido.total || 0)
                    .toFixed(2)
                    .replace(".", ",");


            // ================================
            // PEDIDO
            // ================================

            area.innerHTML += `

                <div class="pedido-admin">

                    <div class="pedido-topo">

                        <div class="pedido-identificacao">

                            <div class="icone-pedido">

                                <i class="fa-solid fa-bag-shopping"></i>

                            </div>

                            <div>

                                <h3>
                                    Pedido #${pedido.id}
                                </h3>

                                <p>
                                    ${dataFormatada}
                                </p>

                            </div>

                        </div>


                        <select
                            class="status-pedido status-${statusSalvo
                                .toLowerCase()
                                .replaceAll(" ", "-")}"
                            onchange="
                                alterarStatusPedido(
                                    ${pedido.id},
                                    this.value,
                                    this
                                )
                            "
                        >

                            <option value="Pendente"
                                ${statusSalvo === "Pendente" ? "selected" : ""}>
                                🟡 Pendente
                            </option>

                            <option value="Em processo"
                                ${statusSalvo === "Em processo" ? "selected" : ""}>
                                🔵 Em processo
                            </option>

                            <option value="Enviado"
                                ${statusSalvo === "Enviado" ? "selected" : ""}>
                                🟣 Enviado
                            </option>

                            <option value="Entregue"
                                ${statusSalvo === "Entregue" ? "selected" : ""}>
                                🟢 Entregue
                            </option>

                            <option value="Cancelado"
                                ${statusSalvo === "Cancelado" ? "selected" : ""}>
                                🔴 Cancelado
                            </option>

                        </select>

                    </div>


                    <div class="pedido-cliente">

                        <div>

                            <i class="fa-solid fa-user"></i>

                            <strong>
                                ${pedido.nome_usuario || "Cliente"}
                            </strong>

                        </div>

                        <span>
                            ${pedido.email_usuario ||
                            "E-mail não informado"}
                        </span>

                    </div>


                    <div class="pedido-produtos">

                        <h4>
                            <i class="fa-solid fa-box"></i>
                            Produtos do pedido
                        </h4>

                        ${produtosHTML}

                    </div>


                    <div class="pedido-rodape">

                        <span>
                            Total do pedido
                        </span>

                        <strong>
                            R$ ${total}
                        </strong>

                    </div>

                </div>

            `;

        });


        atualizarTotalPedidos();

        atualizarPedidosRecentes(pedidos);


    } catch (erro) {

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );

        pedidos = [];

        atualizarTotalPedidos();

        area.innerHTML = `
            <div class="pedido-vazio">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Não foi possível carregar os pedidos
                </h3>

                <p>
                    Verifique o XAMPP e o arquivo
                    admin_pedidos.php.
                </p>

            </div>
        `;

    }
}


// ============================================
// ALTERAR STATUS
// ============================================

function alterarStatusPedido(
    id,
    status,
    elemento
) {

    localStorage.setItem(
        "statusPedido_" + id,
        status
    );


    if (elemento) {

        elemento.className =
            "status-pedido status-" +
            status
                .toLowerCase()
                .replaceAll(" ", "-");

    }


    atualizarPedidosRecentes(pedidos);

}


// ============================================
// PEDIDOS RECENTES
// ============================================

function atualizarPedidosRecentes(listaPedidos) {

    const area =
        document.getElementById("pedidosRecentes");

    if (!area) return;


    if (
        !listaPedidos ||
        listaPedidos.length === 0
    ) {

        area.innerHTML = `
            <p>Nenhum pedido recente.</p>
        `;

        return;
    }


    area.innerHTML = "";


    listaPedidos
        .slice(0, 5)
        .forEach(function (pedido) {

            const status =
                localStorage.getItem(
                    "statusPedido_" + pedido.id
                ) || "Pendente";


            const total =
                Number(pedido.total || 0)
                    .toFixed(2)
                    .replace(".", ",");


            area.innerHTML += `

                <div class="pedido-recente">

                    <div>

                        <strong>
                            Pedido #${pedido.id}
                        </strong>

                        <p>
                            ${pedido.nome_usuario || "Cliente"}
                        </p>

                    </div>

                    <span class="status-resumo">
                        ${status}
                    </span>

                    <strong>
                        R$ ${total}
                    </strong>

                </div>

            `;

        });
}


// ============================================
// AVALIAÇÕES
// ============================================

async function listarAvaliacoes() {

    const lista =
        document.getElementById("listaAvaliacoes");

    if (!lista) return;


    lista.innerHTML =
        "<p>Carregando avaliações...</p>";


    try {

        const resposta =
            await fetch(
                URL_AVALIACOES + "?t=" + Date.now()
            );


        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            lista.innerHTML = `
                <p>
                    ${resultado.mensagem ||
                    "Erro ao carregar avaliações."}
                </p>
            `;

            avaliacoes = [];

            atualizarTotalAvaliacoes();

            return;
        }


        avaliacoes =
            resultado.avaliacoes || [];


        if (avaliacoes.length === 0) {

            lista.innerHTML =
                "<p>Nenhuma avaliação encontrada.</p>";

            atualizarTotalAvaliacoes();

            return;
        }


        lista.innerHTML = "";


        avaliacoes.forEach(function (avaliacao) {

            const nota =
                Number(avaliacao.nota || 0);


            const estrelas =
                "★".repeat(nota);


            lista.innerHTML += `

                <div class="avaliacao-admin">

                    <div>

                        <strong>
                            ${avaliacao.nome_usuario ||
                            avaliacao.usuario ||
                            "Cliente"}
                        </strong>

                        <p>
                            ${avaliacao.nome_produto ||
                            avaliacao.produto ||
                            "Produto"}
                        </p>

                    </div>

                    <div class="estrelas-admin">
                        ${estrelas || "Sem nota"}
                    </div>

                    <p>
                        ${avaliacao.comentario ||
                        avaliacao.mensagem ||
                        "Sem comentário."}
                    </p>

                </div>

            `;

        });


        atualizarTotalAvaliacoes();


    } catch (erro) {

        console.error(
            "Erro ao listar avaliações:",
            erro
        );

        lista.innerHTML = `
            <p>
                Não foi possível carregar as avaliações.
            </p>
        `;

    }
}


// ============================================
// MENSAGENS
// ============================================

function listarMensagens() {

    const lista =
        document.getElementById("listaMensagens");

    if (!lista) return;


    // ============================================
    // MENSAGENS FICTÍCIAS
    // ============================================

    mensagens = [

        {
            nome: "Sofia Ribeiro",
            email: "sofia.ribeiro@lunary.com",
            assunto: "Dúvida sobre produto",
            mensagem: "Olá! Gostaria de saber se vocês terão reposição daquele produto que está esgotado no site.",
            data: "01/10/2026",
            status: "Nova"
        },

        {
            nome: "Rafaela Gomes",
            email: "rafaela.gomes@lunary.com",
            assunto: "Pedido realizado",
            mensagem: "Boa tarde! Fiz um pedido recentemente e gostaria de saber quando ele será enviado.",
            data: "30/09/2026",
            status: "Respondida"
        },

        {
            nome: "Natalia Ferreira",
            email: "natalia.ferreira@lunary.com",
            assunto: "Elogio",
            mensagem: "Adorei a experiência de compra! O produto chegou certinho e antes do prazo. Parabéns pelo atendimento.",
            data: "29/09/2026",
            status: "Respondida"
        },

        {
            nome: "Mariana Rocha",
            email: "mariana.rocha@lunary.com",
            assunto: "Cupom de desconto",
            mensagem: "Gostaria de saber se existe algum cupom de desconto para minha próxima compra.",
            data: "28/09/2026",
            status: "Nova"
        },

        {
            nome: "Larissa Mendes",
            email: "larissa.mendes@lunary.com",
            assunto: "Prazo de entrega",
            mensagem: "Olá! Vocês poderiam me informar qual é o prazo médio de entrega para Curitiba?",
            data: "27/09/2026",
            status: "Nova"
        },

        {
            nome: "Juliana Pereira",
            email: "juliana.pereira@lunary.com",
            assunto: "Forma de pagamento",
            mensagem: "Gostaria de saber quais formas de pagamento estão disponíveis para realizar uma compra.",
            data: "26/09/2026",
            status: "Respondida"
        }

    ];


    // ============================================
    // MOSTRAR MENSAGENS
    // ============================================

    lista.innerHTML = "";


    mensagens.forEach(function (mensagem) {

        const inicial =
            mensagem.nome.charAt(0).toUpperCase();

        const classeStatus =
            mensagem.status === "Nova"
                ? "mensagem-nova"
                : "mensagem-respondida";


        lista.innerHTML += `

            <div class="mensagem-admin">

                <div class="mensagem-cabecalho">

                    <div class="cliente-mensagem">

                        <div class="avatar-mensagem">
                            ${inicial}
                        </div>

                        <div class="dados-mensagem">

                            <h3>
                                ${mensagem.nome}
                            </h3>

                            <span>
                                ${mensagem.email}
                            </span>

                        </div>

                    </div>


                    <div class="data-mensagem">
                        ${mensagem.data}
                    </div>

                </div>


                <div class="mensagem-conteudo">

                    <span class="assunto-mensagem">
                        ${mensagem.assunto}
                    </span>

                    <p>
                        ${mensagem.mensagem}
                    </p>

                </div>


                <div class="mensagem-rodape">

                    <span class="status-mensagem ${classeStatus}">
                        ${mensagem.status}
                    </span>

                    <button
                        class="btn-mensagem"
                        onclick="alert('Mensagem de ${mensagem.nome}:\\n\\n${mensagem.mensagem}')"
                    >
                        Ver mensagem
                    </button>

                </div>

            </div>

        `;

    });


    // ============================================
    // ATUALIZAR TOTAL NO DASHBOARD
    // ============================================

    const totalMensagens =
        document.getElementById("totalMensagens");

    if (totalMensagens) {

        totalMensagens.textContent =
            mensagens.length;

    }

}

// ============================================
// CUPONS
// ============================================

async function listarCupons() {

    const lista =
        document.getElementById("listaCupons");

    if (!lista) return;


    lista.innerHTML =
        "<p>Carregando cupons...</p>";


    try {

        const resposta =
            await fetch(
                URL_CUPONS + "?t=" + Date.now()
            );


        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar cupons."
            );
        }


        const resultado =
            await resposta.json();


        // Alguns PHP retornam diretamente o array
        // e outros podem retornar { cupons: [...] }

        if (Array.isArray(resultado)) {

            cupons = resultado;

        } else {

            cupons =
                resultado.cupons || [];

        }


        if (cupons.length === 0) {

            lista.innerHTML =
                "<p>Nenhum cupom cadastrado.</p>";

            return;
        }


        lista.innerHTML = "";


        cupons.forEach(function (cupom) {

            const validade =
                cupom.validade
                    ? new Date(
                        cupom.validade + "T00:00:00"
                    ).toLocaleDateString("pt-BR")
                    : "Sem validade";


            lista.innerHTML += `

                <div class="cupom-admin">

                    <div>

                        <strong>
                            ${cupom.codigo}
                        </strong>

                        <p>
                            ${cupom.desconto}% de desconto
                        </p>

                    </div>

                    <span>
                        Válido até ${validade}
                    </span>

                </div>

            `;

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar cupons:",
            erro
        );

        lista.innerHTML = `
            <p>
                Não foi possível carregar os cupons.
            </p>
        `;

    }
}


// ============================================
// TOTAIS
// ============================================

function atualizarTotalUsuarios() {

    const elemento =
        document.getElementById("totalUsuarios");

    if (elemento) {

        elemento.textContent =
            usuarios.length;

    }
}


function atualizarTotalPedidos() {

    const elemento =
        document.getElementById("totalPedidos");

    if (elemento) {

        elemento.textContent =
            pedidos.length;

    }
}


function atualizarTotalAvaliacoes() {

    const elemento =
        document.getElementById("totalAvaliacoes");

    if (elemento) {

        elemento.textContent =
            avaliacoes.length;

    }
}


// ============================================
// DASHBOARD
// ============================================

async function atualizarDashboard() {   
    const totalMensagens = document.getElementById("totalMensagens");

if (totalMensagens) {
    totalMensagens.textContent = mensagens.length;
}

    const totalProdutos =
        document.getElementById("totalProdutos");

    if (totalProdutos) {
        totalProdutos.textContent =
            produtos.length;
    }


    const totalUsuarios =
        document.getElementById("totalUsuarios");

    if (totalUsuarios) {
        totalUsuarios.textContent =
            usuarios.length;
    }


    const totalPedidos =
        document.getElementById("totalPedidos");

    if (totalPedidos) {
        totalPedidos.textContent =
            pedidos.length;
    }


    const totalAvaliacoes =
        document.getElementById("totalAvaliacoes");

    if (totalAvaliacoes) {
        totalAvaliacoes.textContent =
            avaliacoes.length;
    }


    atualizarProdutosDestaque();

    atualizarPedidosRecentes(pedidos);
}


// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Lunary Admin iniciado."
        );


        // Carrega produtos
        await listarProdutos();


        // Carrega usuários
        await listarUsuarios();


        // Carrega pedidos
        await listarPedidos();


        // Carrega avaliações
        await listarAvaliacoes();


        // Carrega mensagens
        listarMensagens();


        // Atualiza dashboard
        atualizarDashboard();


        // Mostra dashboard
        const primeiroLink =
            document.querySelector(".menu-admin a");


        mostrarSecao(
            "dashboard",
            primeiroLink
        );

    }
);
