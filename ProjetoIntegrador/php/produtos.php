<?php

include "conexao.php";

$sql = "SELECT * FROM produtos";
$resultado = $conexao->query($sql);

?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Produtos - Lunary</title>

    <style>

        body {
            margin: 0;
            padding: 30px;
            background-color: #fff2df;
            font-family: Arial, sans-serif;
        }

        h1 {
            text-align: center;
            color: #922424;
            margin-bottom: 40px;
        }

        .produtos {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            max-width: 1200px;
            margin: auto;
        }

        .produto {
            background: white;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .produto img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-radius: 10px;
        }

        .produto h2 {
            color: #922424;
            font-size: 19px;
        }

        .produto p {
            color: #555;
        }

        .preco {
            color: #c26e00 !important;
            font-size: 18px;
            font-weight: bold;
        }

        @media (max-width: 900px) {
            .produtos {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 600px) {
            .produtos {
                grid-template-columns: 1fr;
            }
        }

    </style>

</head>

<body>

    <h1>Nossos Produtos</h1>

    <div class="produtos">

        <?php while ($produto = $resultado->fetch_assoc()) { ?>

            <div class="produto">

                <img 
                    src="../img/<?php echo $produto['imagem']; ?>" 
                    alt="<?php echo $produto['nome']; ?>"
                >

                <h2>
                    <?php echo $produto['nome']; ?>
                </h2>

                <p>
                    <?php echo $produto['descricao']; ?>
                </p>

                <p class="preco">
                    R$ <?php echo number_format($produto['preco'], 2, ',', '.'); ?>
                </p>

            </div>

        <?php } ?>

    </div>

</body>

</html>