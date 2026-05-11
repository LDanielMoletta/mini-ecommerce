// crie cadastro de clientes e que permita cadastrar, editar e excluir clientes, e cada um tenha seu carrinho de compras e depois exportar

const clientes = [];

function cadastrarCliente(nome, email) {
    clientes.push({
        id: clientes.length + 1,
        nome,
        email
    });
}

function listarClientes() {
    return clientes;
}

function buscarClientePorId(id) {
    return clientes.find(cliente => cliente.id == id);
}

module.exports = {
    cadastrarCliente,
    listarClientes,
    buscarClientePorId
};