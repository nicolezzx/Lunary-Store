// ===============================
// SISTEMA DE USUÁRIO - LUNARY
// ===============================


// ===============================
// CADASTRO
// ===============================

function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    if (!nome || !email || !senha) {
        return;
    }

    const nomeValor = nome.value.trim();
    const emailValor = email.value.trim().toLowerCase();
    const senhaValor = senha.value;

    if (!nomeValor || !emailValor || !senhaValor) {

        alert("Preencha todos os campos!");
        return;

    }

    // Verifica se já existe uma conta
    const usuarioExistente =
        JSON.parse(localStorage.getItem("usuarioLunary"));

    if (usuarioExistente &&
        usuarioExistente.email === emailValor) {

        alert("Este e-mail já possui uma conta!");

        return;
    }

    const usuario = {

        nome: nomeValor,
        email: emailValor,
        senha: senhaValor

    };

    localStorage.setItem(
        "usuarioLunary",
        JSON.stringify(usuario)
    );

    alert("Cadastro realizado com sucesso!");

    window.location.href = "login.html";
}


// ===============================
// LOGIN
// ===============================

function fazerLogin(event) {

    event.preventDefault();

    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    if (!email || !senha) {
        return;
    }

    const emailValor =
        email.value.trim().toLowerCase();

    const senhaValor =
        senha.value;

    const usuarioSalvo =
        JSON.parse(
            localStorage.getItem("usuarioLunary")
        );

    if (!usuarioSalvo) {

        alert(
            "Nenhum usuário cadastrado. " +
            "Faça seu cadastro primeiro!"
        );

        return;
    }

    if (
        emailValor === usuarioSalvo.email &&
        senhaValor === usuarioSalvo.senha
    ) {

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioSalvo)
        );

        alert("Login realizado com sucesso!");

        window.location.href = "index.html";

    } else {

        alert("E-mail ou senha incorretos!");

    }
}


function mostrarUsuario() {

    const elementoNome =
        document.getElementById("nomeUsuario");

    const linkUsuario =
        document.getElementById("linkUsuario");

    const usuarioLogado =
        JSON.parse(
            localStorage.getItem("usuarioLogado")
        );

    // Mostra o nome se estiver logado
    if (elementoNome) {

        if (usuarioLogado) {

            elementoNome.textContent =
                usuarioLogado.nome;

        } else {

            elementoNome.textContent = "";

        }

    }

    // Define para onde o ícone do usuário vai
    if (linkUsuario) {

        if (usuarioLogado) {

            linkUsuario.href = "perfil.html";

        } else {

            linkUsuario.href = "login.html";

        }

    }
}


// ===============================
// SAIR DA CONTA
// ===============================

function sairDaConta() {

    localStorage.removeItem("usuarioLogado");

    window.location.href = "index.html";
}


// ===============================
// INICIALIZAÇÃO
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        mostrarUsuario();

    }
);