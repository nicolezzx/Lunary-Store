<?php

require_once "conexao.php";

$sql = "SELECT id, codigo, desconto, validade FROM cupons ORDER BY validade ASC";

$resultado = $conexao->query($sql);

$cupons = [];

while ($cupom = $resultado->fetch_assoc()) {
    $cupons[] = $cupom;
}

header("Content-Type: application/json; charset=UTF-8");

echo json_encode($cupons);

$conexao->close();

?>