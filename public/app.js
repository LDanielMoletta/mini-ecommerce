const statusEl = document.getElementById('status');
const resumoEl = document.getElementById('resumo');
const resultadoEl = document.getElementById('resultado');
const clienteSelect = document.getElementById('cliente-selecionado');
const produtoSelect = document.getElementById('produto-selecionado');

const apiFetch = async (path, options = {}) => {
  try {
    const response = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Erro na requisição');
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};

const carregarStatus = async () => {
  try {
    const response = await apiFetch('/api');
    statusEl.textContent = `${response.message} (${response.status})`;
  } catch (error) {
    statusEl.textContent = `Erro: ${error.message}`;
  }
};

const carregarClientes = async () => {
  try {
    const clientes = await apiFetch('/clientes');
    clienteSelect.innerHTML = clientes
      .map(cliente => `<option value="${cliente.id}">${cliente.nome} (${cliente.email})</option>`)
      .join('');
  } catch (error) {
    clienteSelect.innerHTML = '<option value="">Erro ao carregar clientes</option>';
  }
};

const carregarProdutos = async () => {
  try {
    const produtos = await apiFetch('/produtos');
    produtoSelect.innerHTML = produtos
      .map(produto => `<option value="${produto.id}">${produto.nome} — R$ ${produto.preco.toFixed(2)}</option>`)
      .join('');
  } catch (error) {
    produtoSelect.innerHTML = '<option value="">Erro ao carregar produtos</option>';
  }
};

const atualizarResumo = async () => {
  try {
    const estado = await apiFetch('/estado');
    if (!estado.clienteSelecionado) {
      resumoEl.textContent = 'Nenhum cliente selecionado.';
      return;
    }

    const linhas = [];
    linhas.push(`Cliente: ${estado.clienteSelecionado.nome} (${estado.clienteSelecionado.email})`);
    linhas.push(`Endereço: ${estado.enderecoEntrega || 'Não definido'}`);
    linhas.push(`Pagamento: ${estado.metodoPagamento || 'Não definido'}`);
    linhas.push('Itens do carrinho:');
    if (estado.carrinho.length === 0) {
      linhas.push('  Nenhum item adicionado.');
    } else {
      estado.carrinho.forEach((item, index) => {
        linhas.push(
          `  ${index + 1}. ${item.produto} x ${item.quantidade} — R$ ${item.valorUnitario.toFixed(2)} com desconto ${item.desconto}% = R$ ${item.total.toFixed(2)}`
        );
      });
    }

    resumoEl.textContent = linhas.join('\n');
  } catch (error) {
    resumoEl.textContent = `Erro: ${error.message}`;
  }
};

const createNotification = (element, message) => {
  element.textContent = message;
};

const formatarCupom = (cupom) => {
  const { cliente, enderecoEntrega, metodoPagamento, itens, subtotal, descontos, total } = cupom;
  
  let html = '<div class="cupom-fiscal">';
  html += '<h3>🧾 CUPOM FISCAL</h3>';
  
  html += '<div class="cupom-info">';
  html += `<p><strong>Cliente:</strong> ${cliente.nome}</p>`;
  html += `<p><strong>Email:</strong> ${cliente.email}</p>`;
  html += `<p><strong>Endereço de Entrega:</strong> ${enderecoEntrega}</p>`;
  html += `<p><strong>Método de Pagamento:</strong> ${metodoPagamento}</p>`;
  html += '</div>';
  
  html += '<table class="cupom-tabela">';
  html += '<thead><tr><th>Produto</th><th>Qtd</th><th>Unit (R$)</th><th>Desconto</th><th>Total (R$)</th></tr></thead>';
  html += '<tbody>';
  
  itens.forEach(item => {
    html += `<tr>`;
    html += `<td>${item.produto}</td>`;
    html += `<td class="text-center">${item.quantidade}</td>`;
    html += `<td class="text-right">${item.valorUnitario}</td>`;
    html += `<td class="text-center">${item.desconto}</td>`;
    html += `<td class="text-right">${item.total}</td>`;
    html += `</tr>`;
  });
  
  html += '</tbody></table>';
  
  html += '<div class="cupom-resumo">';
  html += `<div class="resumo-linha"><span>Subtotal:</span><span class="valor">${subtotal}</span></div>`;
  html += `<div class="resumo-linha"><span>Descontos:</span><span class="valor">${descontos}</span></div>`;
  html += `<div class="resumo-linha total"><span>TOTAL:</span><span class="valor">${total}</span></div>`;
  html += '</div>';
  
  html += '</div>';
  
  return html;
};

const produtoForm = document.getElementById('produto-form');
const clienteForm = document.getElementById('cliente-form');
const adicionarItemBtn = document.getElementById('adicionar-item');
const definirDadosBtn = document.getElementById('definir-dados');
const atualizarCarrinhoBtn = document.getElementById('atualizar-carrinho');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

produtoForm.addEventListener('submit', async event => {
  event.preventDefault();
  const nome = document.getElementById('produto-nome').value.trim();
  const preco = parseFloat(document.getElementById('produto-preco').value);

  try {
    const resposta = await apiFetch('/produtos', {
      method: 'POST',
      body: JSON.stringify({ nome, preco }),
    });
    createNotification(statusEl, resposta.message);
    produtoForm.reset();
    await carregarProdutos();
  } catch (error) {
    createNotification(statusEl, error.message);
  }
});

clienteForm.addEventListener('submit', async event => {
  event.preventDefault();
  const nome = document.getElementById('cliente-nome').value.trim();
  const email = document.getElementById('cliente-email').value.trim();

  try {
    const resposta = await apiFetch('/clientes', {
      method: 'POST',
      body: JSON.stringify({ nome, email }),
    });
    createNotification(statusEl, resposta.message);
    clienteForm.reset();
    await carregarClientes();
  } catch (error) {
    createNotification(statusEl, error.message);
  }
});

adicionarItemBtn.addEventListener('click', async () => {
  const clienteId = clienteSelect.value;
  const produtoId = produtoSelect.value;
  const quantidade = parseInt(document.getElementById('item-quantidade').value, 10);
  const desconto = parseFloat(document.getElementById('item-desconto').value);

  try {
    const resposta = await apiFetch('/carrinho', {
      method: 'POST',
      body: JSON.stringify({ clienteId, produtoId, quantidade, desconto }),
    });
    createNotification(statusEl, resposta.message);
    await atualizarResumo();
  } catch (error) {
    createNotification(statusEl, error.message);
  }
});

definirDadosBtn.addEventListener('click', async () => {
  const metodo = document.getElementById('pagamento-metodo').value.trim();
  const endereco = document.getElementById('endereco-entrega').value.trim();

  try {
    if (metodo) {
      await apiFetch('/pagamento', {
        method: 'POST',
        body: JSON.stringify({ metodo }),
      });
    }
    if (endereco) {
      await apiFetch('/endereco', {
        method: 'POST',
        body: JSON.stringify({ endereco }),
      });
    }
    createNotification(statusEl, 'Dados de pagamento e entrega definidos.');
    await atualizarResumo();
  } catch (error) {
    createNotification(statusEl, error.message);
  }
});

atualizarCarrinhoBtn.addEventListener('click', atualizarResumo);

finalizarCompraBtn.addEventListener('click', async () => {
  try {
    const resposta = await apiFetch('/finalizar', {
      method: 'POST',
    });
    resultadoEl.innerHTML = formatarCupom(resposta.cupom);
    createNotification(statusEl, resposta.message);
    await carregarClientes();
    await carregarProdutos();
    await atualizarResumo();
  } catch (error) {
    createNotification(statusEl, error.message);
  }
});

const inicializar = async () => {
  await carregarStatus();
  await carregarClientes();
  await carregarProdutos();
  await atualizarResumo();
};

inicializar();
