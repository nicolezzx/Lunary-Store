<?php

header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli(
    "localhost",
    "root",
    "",
    "lunary store"
);

if ($conn->connect_error) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao conectar ao banco de dados."
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

$acao = $_POST["acao"] ?? $_GET["acao"] ?? "";


// =====================================================
// LISTAR PRODUTOS
// =====================================================

if ($acao === "listar") {

    $resultado = $conn->query("
        SELECT id, nome, descricao, preco, imagem, categoria, estoque
        FROM produtos
        ORDER BY id DESC
    ");

    $produtos = [];

    while ($produto = $resultado->fetch_assoc()) {
        $produto["preco"] = (float) $produto["preco"];
        $produto["estoque"] = (int) $produto["estoque"];

        $produtos[] = $produto;
    }

    echo json_encode([
        "sucesso" => true,
        "produtos" => $produtos
    ]);

    exit;
}


// =====================================================
// ADICIONAR PRODUTO
// =====================================================

if ($acao === "adicionar") {

    $nome = trim($_POST["nome"] ?? "");
    $descricao = trim($_POST["descricao"] ?? "");
    $preco = $_POST["preco"] ?? 0;
    $categoria = trim($_POST["categoria"] ?? "");
    $estoque = $_POST["estoque"] ?? 0;

    if ($nome === "" || $preco === "") {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Preencha o nome e o preço do produto."
        ]);

        exit;
    }


    // IMAGEM
    $imagem = "";

    if (isset($_FILES["imagem"]) && $_FILES["imagem"]["error"] === UPLOAD_ERR_OK) {

        $pasta = "../img/produtos/";

        if (!is_dir($pasta)) {
            mkdir($pasta, 0777, true);
        }

        $extensao = strtolower(
            pathinfo($_FILES["imagem"]["name"], PATHINFO_EXTENSION)
        );

        $extensoesPermitidas = [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ];

        if (!in_array($extensao, $extensoesPermitidas)) {

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Formato de imagem inválido. Use JPG, PNG ou WEBP."
            ]);

            exit;
        }

        $nomeArquivo =
            uniqid("produto_") . "." . $extensao;

        $caminho = $pasta . $nomeArquivo;

        if (!move_uploaded_file(
            $_FILES["imagem"]["tmp_name"],
            $caminho
        )) {

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Não foi possível salvar a imagem."
            ]);

            exit;
        }

        $imagem = "../img/produtos/" . $nomeArquivo;
    }


    $stmt = $conn->prepare("
        INSERT INTO produtos
        (nome, descricao, preco, imagem, categoria, estoque)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

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
            "mensagem" => "Produto adicionado com sucesso!"
        ]);

    } else {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Erro ao adicionar produto."
        ]);
    }

    exit;
}


// =====================================================
// EDITAR PRODUTO
// =====================================================

if ($acao === "editar") {

    $id = intval($_POST["id"] ?? 0);

    $nome = trim($_POST["nome"] ?? "");
    $descricao = trim($_POST["descricao"] ?? "");
    $preco = $_POST["preco"] ?? 0;
    $categoria = trim($_POST["categoria"] ?? "");
    $estoque = $_POST["estoque"] ?? 0;

    if ($id <= 0 || $nome === "") {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Dados inválidos."
        ]);

        exit;
    }


    // Verifica se foi enviada uma nova imagem
    if (
        isset($_FILES["imagem"]) &&
        $_FILES["imagem"]["error"] === UPLOAD_ERR_OK
    ) {

        $pasta = "../img/produtos/";

        if (!is_dir($pasta)) {
            mkdir($pasta, 0777, true);
        }

        $extensao = strtolower(
            pathinfo($_FILES["imagem"]["name"], PATHINFO_EXTENSION)
        );

        $extensoesPermitidas = [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ];

        if (!in_array($extensao, $extensoesPermitidas)) {

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Formato de imagem inválido."
            ]);

            exit;
        }

        $nomeArquivo =
            uniqid("produto_") . "." . $extensao;

        $caminho = $pasta . $nomeArquivo;

        move_uploaded_file(
            $_FILES["imagem"]["tmp_name"],
            $caminho
        );

        $imagem = "../img/produtos/" . $nomeArquivo;


        $stmt = $conn->prepare("
            UPDATE produtos
            SET nome = ?,
                descricao = ?,
                preco = ?,
                imagem = ?,
                categoria = ?,
                estoque = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "ssdssii",
            $nome,
            $descricao,
            $preco,
            $imagem,
            $categoria,
            $estoque,
            $id
        );

    } else {

        $stmt = $conn->prepare("
            UPDATE produtos
            SET nome = ?,
                descricao = ?,
                preco = ?,
                categoria = ?,
                estoque = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "ssdssi",
            $nome,
            $descricao,
            $preco,
            $categoria,
            $estoque,
            $id
        );
    }


    if ($stmt->execute()) {

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Produto atualizado com sucesso!"
        ]);

    } else {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Erro ao atualizar produto."
        ]);
    }

    exit;
}


// =====================================================
// EXCLUIR PRODUTO
// =====================================================

if ($acao === "excluir") {

    $id = intval($_POST["id"] ?? 0);

    if ($id <= 0) {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Produto inválido."
        ]);

        exit;
    }


    $stmt = $conn->prepare("
        DELETE FROM produtos
        WHERE id = ?
    ");

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Produto excluído com sucesso!"
        ]);

    } else {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Não foi possível excluir o produto."
        ]);
    }

    exit;
}


// =====================================================
// AÇÃO INVÁLIDA
// =====================================================

echo json_encode([
    "sucesso" => false,
    "mensagem" => "Ação inválida."
]);

$conn->close();

?>