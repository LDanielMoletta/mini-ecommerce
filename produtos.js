function criarCatalogo() {
    const catalogo = [];

    function cadastrarProduto(id, nome, preco) {
        const produto = { id, nome, preco };
        catalogo.push(produto);
    }

    function listarProdutos() {
        console.log("Produtos disponíveis:");
        catalogo.forEach(produto => {
            console.log(`ID: ${produto.id}, Nome: ${produto.nome}, Preço: R$${produto.preco.toFixed(2)}`);
        });
    }

    function buscarProdutoPorId(id) {
        return catalogo.find(produto => produto.id === id);
    }

    return {
        cadastrarProduto,
        listarProdutos,
        buscarProdutoPorId
    };
}

module.exports = criarCatalogo();
