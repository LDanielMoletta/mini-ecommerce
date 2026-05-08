function criarCarrinho() {
    const meuCarrinho = [];

    function adicionarItem(produto, quantidade, descontoPercentual) {
        const desconto = produto.preco * (descontoPercentual / 100);
        const precoComDesconto = produto.preco - desconto;
        const subtotal = precoComDesconto * quantidade;
        const valorUnitario = produto.preco;

        const item = {
            produto: produto.nome,
            quantidade,
            desconto: descontoPercentual,
            total: subtotal,
            valorUnitario
        };
        meuCarrinho.push(item);
    }

    function exibirResumo() {
        return meuCarrinho;
    }

    return {
        adicionarItem,
        exibirResumo
    };
}
module.exports = criarCarrinho();
