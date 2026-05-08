const prompt = require('prompt-sync')();

const { cadastrarProduto, listarProdutos, buscarProdutoPorId } = require('./produtos');
const { adicionarItem, exibirResumo } = require('./carrinho');
const { isNumeroValido, isTextoValido } = require('./validacoes');
const { Table } = require ('console-table-printer');

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
                const produtos = listarProdutos();
            
                const tabelaProdutos = new Table({
                    title: 'Catálogo de Produtos',
                    columns: [
                        { name: 'id', title: 'ID', alignment: 'left', color: 'cyan' },
                        { name: 'nome', title: 'Produto', alignment: 'left' },
                        { name: 'preco', title: 'Preço (R$)', alignment: 'right', color: 'green' },
                    ],
                });
            
                produtos.forEach(produto => {
                    tabelaProdutos.addRow({
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco.toFixed(2)
                    });
                });
            
                tabelaProdutos.printTable();
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
                const resumo = exibirResumo();
            
                const tabelaResumo = new Table({
                    title: 'Resumo da Compra',
                    columns: [
                        { name: 'produto', title: 'Produto' },
                        { name: 'quantidade', title: 'Qtd' },
                        { name: 'desconto', title: 'Desc (%)' },
                        { name: 'valorUnitario', title: 'Valor Unitário (R$)', color: 'yellow' },
                        { name: 'valorTotal', title: 'Valor Total sem Desconto (R$)', color: 'magenta' },
                        { name: 'total', title: 'Total (R$)', color: 'green' },
                    ],
                });
            
                resumo.forEach(item => {
                    tabelaResumo.addRow({
                        produto: item.produto,
                        quantidade: item.quantidade,
                        desconto: item.desconto,
                        total: item.total.toFixed(2),
                        valorUnitario: item.valorUnitario.toFixed(2),
                        valorTotal: (item.valorUnitario * item.quantidade).toFixed(2),
                    });
                });
            
                tabelaResumo.printTable();
                break;
        case '0':
            console.log("Saindo...");
            process.exit();

        default:
            console.log("Opção inválida. Tente novamente.");
    }
}



