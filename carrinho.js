//Este é o motor financeiro das compras.
//I. Crie um array vazio chamado meuCarrinho.
//II. Crie a função adicionarItem(produto, quantidade, descontoPercentual). A lógica matemática é com você: calcule o valor do desconto em cima do preço do produto, multiplique pela quantidade e guarde um objeto com o subtotal no meuCarrinho.
//III. Crie a função exibirResumo(). Ela deve somar os subtotais de todos os itens do carrinho e imprimir o valor final que o cliente deve pagar.
//IV. Exporte as duas funções no final do arquivo.

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
