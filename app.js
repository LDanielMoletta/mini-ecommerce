//Chegou a hora de juntar tudo! O arquivo app.js será o "Maestro" da nossa orquestra. É apenas aqui que você vai interagir com o usuário e usar as validações para garantir que ele não digite besteira.
//I. Importe o prompt-sync e todas as funções que você exportou dos seus três módulos. (carrinho, produtos e validacoes). Use require() para isso. O código de importação é com você, mas tente ser organizado e claro para que fique fácil de entender o que está sendo importado e de onde.
//II. Crie um laço de repetição (while) exibindo o Menu Principal:
// [1] Cadastrar Produto
// [2] Ver Catálogo
// [3] Adicionar ao Carrinho
// [4] Ver Resumo da Compra
// [0] Sair
//III. Use switch/case ou if/else para tratar as opções.
//IV. A Regra da Validação: Toda vez que for pedir um dado crítico ao usuário (como Preço ou ID), use um laço de repetição junto com o seu módulo de validações.
// Exemplo lógico: Peça o preço -> Passe o preço para isNumeroValido() -> Se retornar false, avise o erro e peça de novo. Se retornar true, siga em frente e chame a função de cadastrar.

const prompt = require('prompt-sync')();

const { cadastrarProduto, listarProdutos, buscarProdutoPorId } = require('./produtos');
const { adicionarItem, exibirResumo } = require('./carrinho');
const { isNumeroValido, isTextoValido } = require('./validacoes');

while (true) {
    console.log("\nMenu Principal:");
    console.log("[1] Cadastrar Produto");
    console.log("[2] Ver Catálogo");
    console.log("[3] Adicionar ao Carrinho");
    console.log("[4] Ver Resumo da Compra");
    console.log("[0] Sair");

    const opcao = prompt("Escolha uma opção: ");
    switch (opcao) {
        case '1':
            let id, nome, preco;

            do {
                id = prompt("Digite o ID do produto: ");
                if (!isTextoValido(id)) {
                    console.log("ID inválido. Tente novamente.");
                }
            } while (!isTextoValido(id));

            do {
                nome = prompt("Digite o nome do produto: ");
                if (!isTextoValido(nome)) {
                    console.log("Nome inválido. Tente novamente.");
                }
            } while (!isTextoValido(nome));

            do {
                preco = parseFloat(prompt("Digite o preço do produto: "));
                if (!isNumeroValido(preco)) {
                    console.log("Preço inválido. Tente novamente.");
                }
            } while (!isNumeroValido(preco));

            cadastrarProduto(id, nome, preco);
            console.log("Produto cadastrado com sucesso!");
            break;

        case '2':
            listarProdutos();
            break;

        case '3':
            let produtoId, quantidade, desconto;

            do {
                produtoId = prompt("Digite o ID do produto que deseja adicionar ao carrinho: ");
                if (!isTextoValido(produtoId)) {
                    console.log("ID inválido. Tente novamente.");
                }
            } while (!isTextoValido(produtoId));

            const produto = buscarProdutoPorId(produtoId);
            if (!produto) {
                console.log("Produto não encontrado. Tente novamente.");
                break;
            }

            do {
                quantidade = parseInt(prompt("Digite a quantidade: "));
                if (!isNumeroValido(quantidade)) {
                    console.log("Quantidade inválida. Tente novamente.");
                }
            } while (!isNumeroValido(quantidade));

            do {
                desconto = parseFloat(prompt("Digite o desconto percentual (0-100): "));
                if (!isNumeroValido(desconto) || desconto < 0 || desconto > 100) {
                    console.log("Desconto inválido. Tente novamente.");
                }
            } while (!isNumeroValido(desconto) || desconto < 0 || desconto > 100);

            adicionarItem(produto, quantidade, desconto);
            console.log("Produto adicionado ao carrinho!");
            break;

        case '4':
            exibirResumo();
            break;

        case '0':
            console.log("Saindo...");
            process.exit();

        default:
            console.log("Opção inválida. Tente novamente.");
    }
}

