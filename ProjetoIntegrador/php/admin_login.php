<?php

session_start();

require_once "conexao.php";

$email = $_POST["email"] ?? "";
$senha = $_POST["senha"] ?? "";

if (empty($email) || empty($senha)) {
    header("Location: ../html/login-admin.html");
    exit;
}

$sql = "SELECT * FROM usuarios WHERE email = ? AND tipo = 'admin'";

$stmt = $conexao->prepare($sql);

$stmt->bind_param("s", $email);

$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {

    $admin = $resultado->fetch_assoc();

    // Senha usada no teste local
    if ($senha === $admin["senha"]) {

        $_SESSION["admin_id"] = $admin["id"];
        $_SESSION["admin_nome"] = $admin["nome"];

        header("Location: ../html/admin.html");
        exit;

    } else {

        header("Location: ../html/login-admin-erro.html");
        exit;

    }

} else {

    header("Location: ../html/login-admin-erro.html");
    exit;

}

$stmt->close();
$conexao->close();

?>