function criarCarrinho() {
    const meuCarrinho = [];

    function adicionarItem(produto, quantidade, descontoPercentual) {
        const desconto = produto.preco * (descontoPercentual / 100);
        const precoComDesconto = produto.preco - desconto;
        const subtotal = precoComDesconto * quantidade;

        const item = {
            produto,
            quantidade,
            descontoPercentual,
            subtotal
        };

        meuCarrinho.push(item);
    }

    function exibirResumo() {
        const valorFinal = meuCarrinho.reduce((total, item) => total + item.subtotal, 0);
        console.log(`Valor final a pagar: R$${valorFinal.toFixed(2)}`);
    }

    return {
        adicionarItem,
        exibirResumo
    };
}

module.exports = criarCarrinho();
