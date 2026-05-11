const express = require('express');
const cors = require('cors');
const path = require('path');

const { cadastrarProduto, listarProdutos, buscarProdutoPorId } = require('./produtos');
const { cadastrarCliente, listarClientes, buscarClientePorId } = require('./clientes');
const { adicionarItem, exibirResumo, limparCarrinho } = require('./carrinho');
const { isNumeroValido, isTextoValido } = require('./validacoes');

const app = express();
const port = process.env.PORT || 3000;

let clienteSelecionado = null;
let metodoPagamento = null;
let enderecoEntrega = null;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  res.json({ message: 'API mini-ecommerce rodando', status: 'ok' });
});

app.get('/produtos', (req, res) => {
  res.json(listarProdutos());
});

app.post('/produtos', (req, res) => {
  const { nome, preco } = req.body;

  if (!isTextoValido(nome) || !isNumeroValido(preco)) {
    return res.status(400).json({ error: 'Nome ou preço inválido.' });
  }

  cadastrarProduto(nome, preco);
  return res.status(201).json({ message: 'Produto cadastrado com sucesso.' });
});

app.get('/clientes', (req, res) => {
  res.json(listarClientes());
});

app.post('/clientes', (req, res) => {
  const { nome, email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!isTextoValido(nome) || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Nome ou e-mail inválido.' });
  }

  cadastrarCliente(nome, email);
  return res.status(201).json({ message: 'Cliente cadastrado com sucesso.' });
});

app.post('/carrinho', (req, res) => {
  const { clienteId, produtoId, quantidade, desconto } = req.body;

  if (!isTextoValido(clienteId) || !isTextoValido(produtoId)) {
    return res.status(400).json({ error: 'ClienteId ou produtoId inválido.' });
  }

  const cliente = buscarClientePorId(clienteId);
  if (!cliente) {
    return res.status(404).json({ error: 'Cliente não encontrado.' });
  }

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  if (!isNumeroValido(quantidade) || quantidade <= 0) {
    return res.status(400).json({ error: 'Quantidade deve ser um número maior que 0.' });
  }

  if (!isNumeroValido(desconto) || desconto < 0 || desconto > 100) {
    return res.status(400).json({ error: 'Desconto deve ser um número entre 0 e 100.' });
  }

  clienteSelecionado = cliente;
  adicionarItem(produto, quantidade, desconto);
  return res.status(201).json({ message: 'Item adicionado ao carrinho.' });
});

app.get('/carrinho', (req, res) => {
  res.json({ cliente: clienteSelecionado, itens: exibirResumo() });
});

app.post('/pagamento', (req, res) => {
  const { metodo } = req.body;
  if (!isTextoValido(metodo)) {
    return res.status(400).json({ error: 'Método de pagamento inválido.' });
  }

  metodoPagamento = metodo;
  return res.json({ message: 'Método de pagamento definido.', metodoPagamento });
});

app.post('/endereco', (req, res) => {
  const { endereco } = req.body;
  if (!isTextoValido(endereco)) {
    return res.status(400).json({ error: 'Endereço inválido.' });
  }

  enderecoEntrega = endereco;
  return res.json({ message: 'Endereço de entrega definido.', enderecoEntrega });
});

app.post('/finalizar', (req, res) => {
  if (!clienteSelecionado) {
    return res.status(400).json({ error: 'Nenhum cliente selecionado.' });
  }

  const itens = exibirResumo();
  if (itens.length === 0) {
    return res.status(400).json({ error: 'O carrinho está vazio.' });
  }

  const moeda = valor =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  let subtotal = 0;
  let totalFinal = 0;

  const itensResumo = itens.map(item => {
    const totalSemDesconto = item.valorUnitario * item.quantidade;
    subtotal += totalSemDesconto;
    totalFinal += item.total;

    return {
      produto: item.produto,
      quantidade: item.quantidade,
      valorUnitario: moeda(item.valorUnitario),
      total: moeda(item.total),
      desconto: `${item.desconto}%`,
    };
  });

  const totalDescontos = subtotal - totalFinal;

  const cupom = {
    cliente: clienteSelecionado,
    enderecoEntrega: enderecoEntrega || 'Não definido',
    metodoPagamento: metodoPagamento || 'Não definido',
    itens: itensResumo,
    subtotal: moeda(subtotal),
    descontos: `- ${moeda(totalDescontos)}`,
    total: moeda(totalFinal),
  };

  limparCarrinho();
  clienteSelecionado = null;
  metodoPagamento = null;
  enderecoEntrega = null;

  return res.json({ message: 'Compra finalizada.', cupom });
});

app.get('/estado', (req, res) => {
  res.json({
    clienteSelecionado,
    metodoPagamento,
    enderecoEntrega,
    carrinho: exibirResumo(),
  });
});

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`API rodando em http://localhost:${portToUse}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = portToUse + 1;
      console.warn(`Porta ${portToUse} ocupada. Tentando a porta ${nextPort}...`);
      startServer(nextPort);
      return;
    }
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  });
}

startServer(port);
