<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Nenhum dado recebido."
    ]);
    exit;
}

$nome = trim($dados["nome"] ?? "");
$descricao = trim($dados["descricao"] ?? "");
$preco = $dados["preco"] ?? 0;
$imagem = trim($dados["imagem"] ?? "");
$categoria = trim($dados["categoria"] ?? "");
$estoque = $dados["estoque"] ?? 0;

if ($nome === "" || $preco === "") {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Nome e preço são obrigatórios."
    ]);
    exit;
}

$sql = "INSERT INTO produtos 
        (nome, descricao, preco, imagem, categoria, estoque)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "ssdssi",
    $nome,
    $descricao,
    $preco,
    $imagem,
    $categoria,
    $estoque
);

if ($stmt->execute()) {

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Produto cadastrado com sucesso!",
        "id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar produto: " . $stmt->error
    ]);

}

$stmt->close();
$conexao->close();

?>