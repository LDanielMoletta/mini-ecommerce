const prompt = require('prompt-sync')();

const { cadastrarProduto, listarProdutos, buscarProdutoPorId } = require('./produtos');
const { cadastrarCliente, listarClientes, buscarClientePorId } = require('./clientes');
const { adicionarItem, exibirResumo, limparCarrinho } = require('./carrinho');
const { isNumeroValido, isTextoValido } = require('./validacoes');
const { Table } = require ('console-table-printer');
let metodoPagamento = null;
let enderecoEntrega = null;
let clienteSelecionado = null;

while (true) {
    console.log("\nMenu Principal:");
    console.log(`Cliente selecionado: ${clienteSelecionado ? `${clienteSelecionado.nome} (${clienteSelecionado.email})` : 'nenhum'}`);
    console.log(`Itens no carrinho: ${exibirResumo().length}`);
    console.log("[1] Cadastrar Produto");
    console.log("[2] Cadastrar Cliente");
    console.log("[3] Ver Catálogo de Produtos e Clientes");
    console.log("[4] Selecionar cliente e adicionar produtos ao carrinho");
    console.log("[5] Definir metodo de pagamento");
    console.log("[6] Definir endereço de entrega");
    console.log("[7] Finalizar Compra e Gerar Cupom Fiscal");
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
                let nomeCliente, emailCliente;

                do {
                    nomeCliente = prompt("Digite o nome do cliente: ");
                    if (!isTextoValido(nomeCliente)) {
                        console.log("Nome inválido.");
                    }
                } while (!isTextoValido(nomeCliente));

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                do {
                    emailCliente = prompt("Digite o email do cliente: ");
                } while (!emailRegex.test(emailCliente));

                cadastrarCliente(nomeCliente, emailCliente);
                console.log("Cliente cadastrado com sucesso!");
                break;
        case '3':
              const listaProdutos = listarProdutos();
                if (listaProdutos.length === 0) {
                    console.log("Nenhum produto cadastrado.");
                } else {
                    const tabelaProdutos = new Table({
                        title: '📦 CATÁLOGO DE PRODUTOS',
                        columns: [
                            { name: 'id', title: 'ID', alignment: 'left', color: 'cyan' },
                            { name: 'nome', title: 'Produto', alignment: 'left' },
                            { name: 'preco', title: 'Preço (R$)', alignment: 'right', color: 'green' },
                        ],
                    });

                    listaProdutos.forEach(produto => {
                        tabelaProdutos.addRow({
                            id: produto.id,
                            nome: produto.nome,
                            preco: produto.preco.toFixed(2)
                        });
                    });

                    tabelaProdutos.printTable();
                }
              const listaClientes = listarClientes();
                if (listaClientes.length === 0) {
                    console.log("Nenhum cliente cadastrado.");
                } else {
                    const tabelaClientes = new Table({
                        title: '👤 LISTA DE CLIENTES',
                        columns: [
                            { name: 'id', title: 'ID', alignment: 'left', color: 'cyan' },
                            { name: 'nome', title: 'Nome', alignment: 'left' },
                            { name: 'email', title: 'Email', alignment: 'left' },
                        ],
                    });

                    listaClientes.forEach(cliente => {
                        tabelaClientes.addRow({
                            id: cliente.id,
                            nome: cliente.nome,
                            email: cliente.email
                        });
                    });

                    tabelaClientes.printTable();
                }
                break;
                // adicionar produtos ao carrinho do cliente selecionado
        case '4':
            if (listarClientes().length === 0) {
                console.log("Nenhum cliente cadastrado. Cadastre um cliente antes de usar esta opção.");
                break;
            }

            if (listarProdutos().length === 0) {
                console.log("Nenhum produto cadastrado. Cadastre um produto antes de usar esta opção.");
                break;
            }

            let clienteId = prompt("Digite o ID do cliente: ");
            while (!isTextoValido(clienteId)) {
                console.log("ID inválido. Tente novamente.");
                clienteId = prompt("Digite o ID do cliente: ");
            }

            const cliente = buscarClientePorId(clienteId);
            if (!cliente) {
                console.log("Cliente não encontrado. Tente novamente.");
                break;
            }

            clienteSelecionado = cliente;
            console.log(`Cliente selecionado: ${clienteSelecionado.nome} (${clienteSelecionado.email})`);

            let continuar = 's';
            while (continuar.toLowerCase() === 's') {
                let produtoId = prompt("Digite o ID do produto que deseja adicionar ao carrinho: ");
                while (!isTextoValido(produtoId)) {
                    console.log("ID inválido. Tente novamente.");
                    produtoId = prompt("Digite o ID do produto que deseja adicionar ao carrinho: ");
                }

                const produto = buscarProdutoPorId(produtoId);
                if (!produto) {
                    console.log("Produto não encontrado. Tente novamente.");
                    continuar = prompt("Deseja tentar adicionar outro produto? (s/n): ");
                    continue;
                }

                let quantidade = parseInt(prompt("Digite a quantidade: "));
                while (!isNumeroValido(quantidade) || quantidade <= 0) {
                    console.log("Quantidade inválida. Tente novamente.");
                    quantidade = parseInt(prompt("Digite a quantidade: "));
                }

                let desconto = parseFloat(prompt("Digite o desconto percentual (0-100): "));
                while (!isNumeroValido(desconto) || desconto < 0 || desconto > 100) {
                    console.log("Desconto inválido. Tente novamente.");
                    desconto = parseFloat(prompt("Digite o desconto percentual (0-100): "));
                }

                adicionarItem(produto, quantidade, desconto);
                console.log("Produto adicionado ao carrinho!");
                continuar = prompt("Deseja adicionar outro produto para este cliente? (s/n): ");
            }
            break;
        case '5':
                metodoPagamento = prompt("Digite o método de pagamento (ex: Cartão, Pix, Boleto): ");
                while (!isTextoValido(metodoPagamento)) {
                    console.log("Método de pagamento inválido. Tente novamente.");
                    metodoPagamento = prompt("Digite o método de pagamento (ex: Cartão, Pix, Boleto): ");
                }
                console.log(`Método de pagamento definido: ${metodoPagamento}`);
                break;
            case '6':
               enderecoEntrega = prompt("Digite o endereço de entrega: ");
               while (!isTextoValido(enderecoEntrega)) {
                    console.log("Endereço inválido. Tente novamente.");
                    enderecoEntrega = prompt("Digite o endereço de entrega: ");
                }
                console.log(`Endereço de entrega definido: ${enderecoEntrega}`);
                break;
            case '7':
            if (!clienteSelecionado) {
                console.log("Nenhum cliente selecionado. Use a opção 4 para escolher um cliente antes de finalizar a compra.");
                break;
            }

            const resumo = exibirResumo();

            if (resumo.length === 0) {
                console.log("O carrinho está vazio. Adicione itens antes de finalizar a compra.");
                break;
            }

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
                // nome do cliente
                tabelaResumo.addRow({
                    produto: `👤 Cliente: ${clienteSelecionado.nome}`,
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
                console.log("Compra finalizada! Obrigado por comprar conosco.");
                limparCarrinho();
                clienteSelecionado = null;
                metodoPagamento = null;
                enderecoEntrega = null;
                break; 
        case '0':
                console.log("Saindo do sistema. Até mais!");
                process.exit(0);
        default:
                console.log("Opção inválida. Tente novamente.");
    }
}
