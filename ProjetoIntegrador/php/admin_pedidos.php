<?php

header("Content-Type: application/json; charset=utf-8");

require_once "conexao.php";

try {

    // ============================================
    // ALTERAR STATUS DO PEDIDO
    // ============================================

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $dados = json_decode(file_get_contents("php://input"), true);

        $id = isset($dados["id"]) ? intval($dados["id"]) : 0;
        $status = $dados["status"] ?? "";

        $statusPermitidos = [
            "Pendente",
            "Processando",
            "Enviado",
            "Entregue",
            "Cancelado"
        ];

        if ($id <= 0) {
            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Pedido inválido."
            ]);
            exit;
        }

        if (!in_array($status, $statusPermitidos, true)) {
            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Status inválido."
            ]);
            exit;
        }

        $stmt = $conexao->prepare(
            "UPDATE pedidos SET status = ? WHERE id = ?"
        );

        $stmt->bind_param("si", $status, $id);

        if ($stmt->execute()) {

            echo json_encode([
                "sucesso" => true,
                "mensagem" => "Status atualizado com sucesso."
            ]);

        } else {

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Não foi possível atualizar o pedido."
            ]);
        }

        $stmt->close();
        $conexao->close();

        exit;
    }


    // ============================================
    // LISTAR PEDIDOS
    // ============================================

    $sql = "
        SELECT
            p.id,
            p.id_usuario,
            p.total,
            p.data_pedido,
            p.status,
            u.nome AS nome_usuario,
            u.email AS email_usuario
        FROM pedidos p
        LEFT JOIN usuarios u
            ON u.id = p.id_usuario
        ORDER BY p.data_pedido DESC
    ";

    $resultado = $conexao->query($sql);

    if (!$resultado) {
        throw new Exception(
            "Erro ao buscar pedidos: " . $conexao->error
        );
    }


    $pedidos = [];


    while ($pedido = $resultado->fetch_assoc()) {

        $pedido["itens"] = [];


        // ========================================
        // BUSCAR PRODUTOS DO PEDIDO
        // ========================================

        $stmtItens = $conexao->prepare("
            SELECT
                ip.id,
                ip.id_produto,
                ip.quantidade,
                ip.preco,
                pr.nome AS nome_produto,
                pr.imagem
            FROM itens_pedido ip
            LEFT JOIN produtos pr
                ON pr.id = ip.id_produto
            WHERE ip.id_pedido = ?
        ");

        $stmtItens->bind_param(
            "i",
            $pedido["id"]
        );

        $stmtItens->execute();

        $resultadoItens = $stmtItens->get_result();


        while ($item = $resultadoItens->fetch_assoc()) {

            $pedido["itens"][] = $item;

        }


        $stmtItens->close();


        $pedidos[] = $pedido;
    }


    echo json_encode([
        "sucesso" => true,
        "pedidos" => $pedidos
    ], JSON_UNESCAPED_UNICODE);


    $conexao->close();


} catch (Exception $erro) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $erro->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}

?>