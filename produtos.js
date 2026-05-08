function criarCatalogo() {
    const catalogo = [];

    function cadastrarProduto(id, nome, preco) {
        const produto = { id, nome, preco };
        catalogo.push(produto);
    }

    function listarProdutos() {
        return catalogo;
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


