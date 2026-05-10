function criarCatalogo() {
    const catalogo = [];
    function cadastrarProduto(nome, preco) {
        const id = catalogo.length + 1;
        const novoProduto = {
            id: id.toString(),
            nome,
            preco
        };
        catalogo.push(novoProduto);
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


