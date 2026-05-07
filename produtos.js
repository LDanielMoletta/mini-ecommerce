// Este arquivo gerencia o que a loja vende.
//I. Crie um array vazio e privado chamado catalogo.
//II. Crie a função cadastrarProduto(id, nome, preco). Ela deve pegar esses 3 parâmetros, montar um objeto e guardar no seu catálogo.
//III. Crie a função listarProdutos(). Ela deve varrer o catálogo e imprimir na tela os itens disponíveis, mostrando o ID, nome e preço de cada um. O formato de exibição é com você, mas deve ser fácil de ler e entender. 
//IV. Crie a função buscarProdutoPorId(id). A sua missão aqui é encontrar no catálogo o produto que tenha esse exato ID e retorná-lo.
//V. Exporte as três funções no final do arquivo.

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
