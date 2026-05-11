function criarCarrinho() {
    const meuCarrinho = [];

    function adicionarItem(produto, quantidade, descontoPercentual) {
        const desconto = produto.preco * (descontoPercentual / 100);
        const precoComDesconto = produto.preco - desconto;
        const subtotal = precoComDesconto * quantidade;
        const valorUnitario = produto.preco;
        const valorTotaldosItens = precoComDesconto * quantidade;

        const item = {
            produto: produto.nome,
            quantidade,
            desconto: descontoPercentual,
            total: subtotal,
            valorUnitario,
            valorTotaldosItens
        };
        meuCarrinho.push(item);
    }

    function exibirResumo() {
        return meuCarrinho;
    }

    function limparCarrinho() {
        meuCarrinho.length = 0;
    }

    return {
        adicionarItem,
        exibirResumo,
        limparCarrinho
    };
}
module.exports = criarCarrinho();
