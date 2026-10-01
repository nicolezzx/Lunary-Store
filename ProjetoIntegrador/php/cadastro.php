<?php

require_once "conexao.php";

$nome = $_POST["nome"] ?? "";
$email = $_POST["email"] ?? "";
$senha = $_POST["senha"] ?? "";
$telefone = $_POST["telefone"] ?? "";

if (empty($nome) || empty($email) || empty($senha)) {
    die("Preencha todos os campos obrigatórios.");
}

// Verifica se o e-mail já existe
$sql = "SELECT id FROM usuarios WHERE email = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {

    die("Este e-mail já está cadastrado. Tente entrar na sua conta.");

}

// Protege a senha antes de salvar
$senhaSegura = password_hash($senha, PASSWORD_DEFAULT);

// Salva o novo usuário
$sql = "INSERT INTO usuarios (nome, email, senha, telefone, tipo)
        VALUES (?, ?, ?, ?, 'cliente')";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssss",
    $nome,
    $email,
    $senhaSegura,
    $telefone
);

if ($stmt->execute()) {

    header("Location: ../html/login.html");
    exit;

} else {

    echo "Erro ao criar a conta: " . $conexao->error;

}

$stmt->close();
$conexao->close();

?>