
<?php

require_once "conexao.php";

header("Content-Type: application/json; charset=UTF-8");

$sql = "
    SELECT
        a.id,
        a.produto_id,
        a.nome,
        a.nota,
        a.comentario,
        a.data_avaliacao,
        p.nome AS nome_produto
    FROM avaliacoes a
    LEFT JOIN produtos p
        ON a.produto_id = p.id
    ORDER BY a.data_avaliacao DESC
";

$resultado = $conexao->query($sql);

if (!$resultado) {
    http_response_code(500);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar avaliações."
    ], JSON_UNESCAPED_UNICODE);

    $conexao->close();
    exit;
}

$avaliacoes = [];

while ($avaliacao = $resultado->fetch_assoc()) {
    $avaliacoes[] = $avaliacao;
}

echo json_encode([
    "sucesso" => true,
    "avaliacoes" => $avaliacoes
], JSON_UNESCAPED_UNICODE);

$conexao->close();

?>
