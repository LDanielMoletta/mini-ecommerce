const prompt = require('prompt-sync')();

const { cadastrarProduto, listarProdutos, buscarProdutoPorId } = require('./produtos');
const { adicionarItem, exibirResumo } = require('./carrinho');
const { isNumeroValido, isTextoValido } = require('./validacoes');
const { Table } = require ('console-table-printer');
let metodoPagamento = null;
let enderecoEntrega = null;

while (true) {
    console.log("\nMenu Principal:");
    console.log("[1] Cadastrar Produto");
    console.log("[2] Ver Catálogo");
    console.log("[3] Adicionar ao Carrinho");
    console.log("[4] Definir Método de Pagamento");
    console.log("[5] Definir Endereço de Entrega");
    console.log("[6] resumo da compra");
    console.log("[0] Sair");

    const opcao = prompt("Escolha uma opção: ");
    switch (opcao) {
        case '1':
                let nome, preco;
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

                cadastrarProduto(nome, preco);
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
                metodoPagamento = prompt("Digite o método de pagamento (ex: Cartão, Pix, Boleto): ");
                console.log(`Método de pagamento definido: ${metodoPagamento}`);
                break;
// adicinar opções de pagamento e entrega aqui e finalizar compra
            case '5':
               enderecoEntrega = prompt("Digite o endereço de entrega: ");
                console.log(`Endereço de entrega definido: ${enderecoEntrega}`);
                break;
            case '6':
            const resumo = exibirResumo();

                const moeda = valor =>
                    valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                let subtotal = 0;
                let totalFinal = 0;

                const tabelaResumo = new Table({
                    title: '🧾 CUPOM FISCAL',
                    columns: [
                        { name: 'produto', title: 'Produto' },
                        { name: 'quantidade', title: 'Qtd' },
                        { name: 'valorUnitario', title: 'Unit (R$)', color: 'yellow' },
                        { name: 'total', title: 'Total (R$)', color: 'green' },
                    ],
                });

                resumo.forEach(item => {

                    const totalSemDesconto = item.valorUnitario * item.quantidade;

                    subtotal += totalSemDesconto;
                    totalFinal += item.total;

                    tabelaResumo.addRow({
                        produto: item.produto,
                        quantidade: item.quantidade,
                        valorUnitario: moeda(item.valorUnitario),
                        total: moeda(item.total),
                    });
                });

                const totalDescontos = subtotal - totalFinal;

                // linha separadora
                tabelaResumo.addRow({
                    produto: '--------------------------------',
                    quantidade: '',
                    valorUnitario: '',
                    total: '',
                });

                // subtotal
                tabelaResumo.addRow({
                    produto: 'SUBTOTAL',
                    quantidade: '',
                    valorUnitario: '',
                    total: moeda(subtotal),
                });

                // descontos
                tabelaResumo.addRow({
                    produto: 'DESCONTOS',
                    quantidade: '',
                    valorUnitario: '',
                    total: `- ${moeda(totalDescontos)}`,
                });

                // separador
                tabelaResumo.addRow({
                    produto: '================================',
                    quantidade: '',
                    valorUnitario: '',
                    total: '',
                });

                // total final
                tabelaResumo.addRow({
                    produto: '💰 TOTAL A PAGAR',
                    quantidade: '',
                    valorUnitario: '',
                    total: moeda(totalFinal),
                });
                // separador
                tabelaResumo.addRow({
                    produto: '================================',
                    quantidade: '',
                    valorUnitario: '',
                    total: '',
                });
                // endereço de entrega
                tabelaResumo.addRow({
                    produto: `📍 Endereço de Entrega: ${enderecoEntrega || 'Não definido'}`,
                    quantidade: '',
                    valorUnitario: '',
                    total: '',
                });
             // separador
                tabelaResumo.addRow({
                    produto: '================================',
                    quantidade: '',
                    valorUnitario: '',
                    total: '',
                });
                // método de pagamento
                tabelaResumo.addRow({
                    produto: `💳 Método de Pagamento: ${metodoPagamento || 'Não definido'}`,
                    quantidade: '',
                    valorUnitario: '',
                    total: '',
                });
                tabelaResumo.printTable();
                // finalizar compra
                console.log("Compra finalizada! Obrigado por comprar conosco.");
                break;
        case '0':
                console.log("Saindo do sistema. Até mais!");
                process.exit(0);
        default:
                console.log("Opção inválida. Tente novamente.");
    }
}
