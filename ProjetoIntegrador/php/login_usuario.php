<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";


$dados = json_decode(
    file_get_contents("php://input"),
    true
);


$email = trim(
    strtolower(
        $dados["email"] ?? ""
    )
);

$senha = $dados["senha"] ?? "";


if (empty($email) || empty($senha)) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Preencha e-mail e senha."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// Procura o usuário
$sql = "SELECT id, nome, email, senha, tipo
        FROM usuarios
        WHERE email = ?
        LIMIT 1";

$stmt = $conexao->prepare($sql);

$stmt->bind_param("s", $email);

$stmt->execute();

$resultado = $stmt->get_result();


if ($resultado->num_rows === 0) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "E-mail ou senha incorretos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$usuario = $resultado->fetch_assoc();


// Confere a senha criptografada
if (!password_verify($senha, $usuario["senha"])) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "E-mail ou senha incorretos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// Não envia a senha para o navegador
unset($usuario["senha"]);


echo json_encode([
    "sucesso" => true,
    "mensagem" => "Login realizado com sucesso!",
    "usuario" => $usuario
], JSON_UNESCAPED_UNICODE);


$stmt->close();
$conexao->close();

?>