<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";


// ============================================
// BUSCAR USUÁRIOS
// ============================================

$sql = "
    SELECT
        id,
        nome,
        email,
        telefone,
        data_cadastro,
        tipo
    FROM usuarios
    ORDER BY id DESC
";


$resultado = $conexao->query($sql);

$usuarios = [];


if ($resultado) {

    while ($usuario = $resultado->fetch_assoc()) {

        $usuarios[] = $usuario;

    }


    echo json_encode([

        "sucesso" => true,

        "usuarios" => $usuarios

    ], JSON_UNESCAPED_UNICODE);


} else {

    echo json_encode([

        "sucesso" => false,

        "mensagem" => "Erro ao buscar usuários."

    ], JSON_UNESCAPED_UNICODE);

}


$conexao->close();

?>