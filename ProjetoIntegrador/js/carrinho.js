// ===============================
// CARRINHO - LUNARY
// ===============================

// Pega o carrinho salvo no navegador
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Cupom aplicado
let cupomAplicado = "";

// Cupons disponíveis
const cupons = {
    LUNARY10: 10,
    COZY15: 15,
    BOHO20: 20,
    VELAS15: 15,
    KIT25: 25,
    FRETEGRATIS: 0
};


// ===============================
// ADICIONAR PRODUTO
// ===============================

function adicionarCarrinho(nome, preco, imagem) {

    carrinho.push({
        nome: nome,
        preco: Number(preco),
        imagem: imagem
    });

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    atualizarContador();

    mostrarToast("Produto adicionado ao carrinho!");
}


// ===============================
// CONTADOR DO CARRINHO
// ===============================

function atualizarContador() {

    const contador =
        document.getElementById("contadorCarrinho");

    if (!contador) return;

    if (carrinho.length === 0) {

        contador.style.display = "none";

    } else {

        contador.style.display = "flex";
        contador.textContent = carrinho.length;

    }
}


// ===============================
// MOSTRAR CARRINHO
// ===============================

function mostrarCarrinho() {

    const lista =
        document.getElementById("listaCarrinho");

    const totalElemento =
        document.getElementById("total");

    const subtotalElemento =
        document.getElementById("subtotal");

    const quantidadeElemento =
        document.getElementById("quantidade");

    const descontoElemento =
        document.getElementById("desconto");

    const freteElemento =
        document.getElementById("frete");

    if (!lista) return;

    lista.innerHTML = "";

    let subtotal = 0;

    carrinho.forEach((produto, index) => {

        subtotal += Number(produto.preco);

        lista.innerHTML += `
            <div class="item">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}">

                <div class="item-info">

                    <h3>${produto.nome}</h3>

                    <p>
                        R$ ${Number(produto.preco)
                            .toFixed(2)
                            .replace(".", ",")}
                    </p>

                </div>

                <button
                    class="remover"
                    onclick="removerProduto(${index})">

                    Remover

                </button>

            </div>
        `;
    });

    let desconto = calcularDesconto(subtotal);

    let frete = 0;

    // Frete grátis acima de R$199
    if (carrinho.length > 0 && subtotal < 199) {
    frete = 15;
    }

    // Cupom de frete grátis
    if (cupomAplicado === "FRETEGRATIS") {
        frete = 0;
    }

    let total = subtotal - desconto + frete;

    if (total < 0) {
        total = 0;
    }

    if (quantidadeElemento) {
        quantidadeElemento.textContent = carrinho.length;
    }

    if (subtotalElemento) {
        subtotalElemento.textContent =
            "R$ " +
            subtotal.toFixed(2).replace(".", ",");
    }

    if (descontoElemento) {
        descontoElemento.textContent =
            "R$ " +
            desconto.toFixed(2).replace(".", ",");
    }

    if (freteElemento) {

        freteElemento.textContent =
            frete === 0
                ? "Grátis"
                : "R$ " +
                  frete.toFixed(2).replace(".", ",");
    }

    if (totalElemento) {
        totalElemento.textContent =
            "R$ " +
            total.toFixed(2).replace(".", ",");
    }
}


// ===============================
// CALCULAR DESCONTO
// ===============================

function calcularDesconto(subtotal) {

    if (!cupomAplicado) {
        return 0;
    }

    if (cupomAplicado === "FRETEGRATIS") {
        return 0;
    }

    const porcentagem =
        cupons[cupomAplicado];

    if (!porcentagem) {
        return 0;
    }

    return subtotal * (porcentagem / 100);
}


// ===============================
// APLICAR CUPOM
// ===============================

function aplicarCupom() {

    const campo =
        document.getElementById("campoCupom");

    const mensagem =
        document.getElementById("mensagemCupom");

    if (!campo || !mensagem) return;

    const codigo =
        campo.value.trim().toUpperCase();

    if (codigo === "") {

        mensagem.textContent =
            "Digite um cupom.";

        mensagem.className =
            "erro-cupom";

        return;
    }

    if (!cupons.hasOwnProperty(codigo)) {

        mensagem.textContent =
            "Cupom inválido.";

        mensagem.className =
            "erro-cupom";

        cupomAplicado = "";

        mostrarCarrinho();

        return;
    }

    cupomAplicado = codigo;

    mensagem.textContent =
        "Cupom aplicado com sucesso!";

    mensagem.className =
        "sucesso-cupom";

    campo.value = codigo;

    mostrarCarrinho();
}


// ===============================
// REMOVER PRODUTO
// ===============================

function removerProduto(indice) {

    carrinho.splice(indice, 1);

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    mostrarCarrinho();

    atualizarContador();
}


// ===============================
// FORMA DE PAGAMENTO
// ===============================

function mostrarPagamento() {

    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );

    const dadosCartao =
        document.getElementById("dadosCartao");

    const pagamentoPix =
        document.getElementById("pagamentoPix");

    const pagamentoBoleto =
        document.getElementById("pagamentoBoleto");

    const resultado =
        document.getElementById("resultadoPagamento");


    if (!pagamento) return;


    // Limpa os resultados anteriores

    if (pagamentoPix) {
        pagamentoPix.innerHTML = "";
    }

    if (pagamentoBoleto) {
        pagamentoBoleto.innerHTML = "";
    }

    if (resultado) {
        resultado.innerHTML = "";
    }


    // Esconde cartão

    if (dadosCartao) {
        dadosCartao.style.display = "none";
    }


    // ===========================
    // PIX
    // ===========================

    if (pagamento.value === "pix") {

        if (pagamentoPix) {

            pagamentoPix.innerHTML = `
                <button
                    type="button"
                    class="btn-gerar-pagamento"
                    onclick="gerarPagamentoPix()">

                    <i class="fa-brands fa-pix"></i>
                    Gerar pagamento Pix

                </button>
            `;
        }
    }


    // ===========================
    // CARTÃO
    // ===========================

    else if (pagamento.value === "cartao") {

        if (dadosCartao) {
            dadosCartao.style.display = "block";
        }
    }


    // ===========================
    // BOLETO
    // ===========================

    else if (pagamento.value === "boleto") {

        if (pagamentoBoleto) {

            pagamentoBoleto.innerHTML = `
                <button
                    type="button"
                    class="btn-gerar-pagamento"
                    onclick="gerarBoleto()">

                    <i class="fa-solid fa-barcode"></i>
                    Gerar boleto

                </button>
            `;
        }
    }
}


function gerarChavePix() {

    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, function(c) {

            const r = Math.random() * 16 | 0;

            const v =
                c === "x"
                    ? r
                    : (r & 0x3 | 0x8);

            return v.toString(16);
        });
}


// ===============================
// FINALIZAR COMPRA
// ===============================

function finalizarCompra() {

    const resultado =
        document.getElementById("resultadoPagamento");

    const pagamentoSelecionado =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );

    if (!resultado) return;


    // Carrinho vazio
    if (carrinho.length === 0) {

        resultado.innerHTML = `
            <p class="mensagem-erro">
                Seu carrinho está vazio.
            </p>
        `;

        return;
    }


    // Nenhum pagamento escolhido
    if (!pagamentoSelecionado) {

        resultado.innerHTML = `
            <p class="mensagem-erro">
                Escolha uma forma de pagamento.
            </p>
        `;

        return;
    }


    // ===========================
    // CARTÃO
    // ===========================

    if (pagamentoSelecionado.value === "cartao") {

        const numero =
            document
                .getElementById("numeroCartao")
                .value
                .trim();

        const nome =
            document
                .getElementById("nomeCartao")
                .value
                .trim();

        const validade =
            document
                .getElementById("validadeCartao")
                .value
                .trim();

        const cvv =
            document
                .getElementById("cvvCartao")
                .value
                .trim();


        if (
            numero === "" ||
            nome === "" ||
            validade === "" ||
            cvv === ""
        ) {

            resultado.innerHTML = `
                <p class="mensagem-erro">
                    Preencha todos os dados do cartão.
                </p>
            `;

            return;
        }
    }


    // ===========================
    // FINALIZAR
    // ===========================

    carrinho = [];

    localStorage.removeItem("carrinho");

    cupomAplicado = "";

    sessionStorage.removeItem("chavePix");

    atualizarContador();

    mostrarCarrinho();


    // ===========================
    // IR PARA PÁGINA FINAL
    // ===========================

    window.location.href =
        "compra-finalizada.html";
}

// ===============================
// COPIAR PIX
// ===============================

function copiarPix() {

    const codigo =
        document.getElementById("codigoPix");

    if (!codigo) return;

    navigator.clipboard.writeText(
        codigo.value
    );

    alert("Chave Pix copiada!");
}


// ===============================
// COPIAR BOLETO
// ===============================

function copiarBoleto() {

    const codigo =
        document.getElementById("codigoBoleto");

    if (!codigo) return;

    navigator.clipboard.writeText(
        codigo.value
    );

    alert("Código do boleto copiado!");
}


// ===============================
// TOAST
// ===============================

function mostrarToast(mensagem) {

    const toast =
        document.getElementById("toast");

    const texto =
        document.getElementById("textoToast");

    if (!toast) return;

    if (texto) {
        texto.textContent = mensagem;
    }

    toast.classList.add("mostrar");

    setTimeout(() => {

        toast.classList.remove("mostrar");

    }, 3000);
}


// ===============================
// INICIALIZAÇÃO
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarContador();

        mostrarCarrinho();

        const opcoesPagamento =
            document.querySelectorAll(
                'input[name="pagamento"]'
            );

        opcoesPagamento.forEach(
            function (opcao) {

                opcao.addEventListener(
                    "change",
                    function () {

                        mostrarPagamento();

                        const resultado =
                            document.getElementById(
                                "resultadoPagamento"
                            );

                        if (resultado) {
                            resultado.innerHTML = "";
                        }
                    }
                );
            }
        );
    }
);

// ===============================
// GERAR PAGAMENTO PIX
// ===============================

function gerarPagamentoPix() {

    const pagamentoPix =
        document.getElementById("pagamentoPix");

    if (!pagamentoPix) return;

    const chavePix =
        gerarChavePix();

    sessionStorage.setItem(
        "chavePix",
        chavePix
    );

    const qrCode =
        "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="
        + encodeURIComponent(chavePix);

    pagamentoPix.innerHTML = `
        <div class="pix-gerado">

            <h4>Pagamento via Pix</h4>

            <p>
                Escaneie o QR Code ou copie a chave abaixo:
            </p>

            <img
                src="${qrCode}"
                alt="QR Code Pix"
                class="qr-code">

            <div class="chave-pix">
                ${chavePix}
            </div>

            <button
                type="button"
                class="btn-copiar"
                onclick="copiarPix()">

                <i class="fa-regular fa-copy"></i>
                Copiar chave Pix

            </button>

            <p class="pix-aviso">
                Chave Pix demonstrativa para este projeto.
            </p>

        </div>
    `;
}


// ===============================
// GERAR BOLETO
// ===============================

function gerarBoleto() {

    const pagamentoBoleto =
        document.getElementById("pagamentoBoleto");

    if (!pagamentoBoleto) return;

    const codigoBoleto =
        "34191.79001 01043.510047 91020.150008 1 12345678900000";

    pagamentoBoleto.innerHTML = `
        <div class="boleto-gerado">

            <h4>Boleto bancário</h4>

            <p>
                Seu boleto foi gerado com sucesso!
            </p>

            <div class="codigo-boleto">
                ${codigoBoleto}
            </div>

            <button
                type="button"
                class="btn-copiar"
                onclick="copiarBoleto()">

                <i class="fa-regular fa-copy"></i>
                Copiar código

            </button>

            <p class="boleto-aviso">
                O boleto vence em 3 dias úteis.
            </p>

        </div>
    `;
}