<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"), true);

$nome = trim($dados["nome"] ?? "");
$email = trim(strtolower($dados["email"] ?? ""));
$senha = $dados["senha"] ?? "";

if (empty($nome) || empty($email) || empty($senha)) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Preencha todos os campos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// Verifica se o e-mail já existe
$sqlVerificar = "SELECT id FROM usuarios WHERE email = ?";

$stmtVerificar = $conexao->prepare($sqlVerificar);

$stmtVerificar->bind_param("s", $email);

$stmtVerificar->execute();

$resultado = $stmtVerificar->get_result();

if ($resultado->num_rows > 0) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Este e-mail já possui uma conta."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// Criptografa a senha
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);


// Usuário normal
$tipo = "cliente";


// Salva no banco
$sql = "INSERT INTO usuarios (nome, email, senha, tipo)
        VALUES (?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssss",
    $nome,
    $email,
    $senhaHash,
    $tipo
);


if ($stmt->execute()) {

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cadastro realizado com sucesso!"
    ], JSON_UNESCAPED_UNICODE);

} else {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar usuário."
    ], JSON_UNESCAPED_UNICODE);

}


$stmt->close();
$stmtVerificar->close();
$conexao->close();

?>