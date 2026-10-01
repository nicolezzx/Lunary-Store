<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

$sql = "SELECT id, nome, descricao, preco, imagem, categoria, estoque
        FROM produtos
        ORDER BY id DESC";

$resultado = $conexao->query($sql);

$produtos = [];

if ($resultado) {

    while ($produto = $resultado->fetch_assoc()) {
        $produtos[] = $produto;
    }

    echo json_encode([
        "sucesso" => true,
        "produtos" => $produtos
    ], JSON_UNESCAPED_UNICODE);

} else {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar produtos."
    ], JSON_UNESCAPED_UNICODE);

}

$conexao->close();

?>