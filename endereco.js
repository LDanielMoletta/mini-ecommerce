//criar função para definir o endereço de entrega
function definirEnderecoEntrega() {
    const endereco = prompt("Digite o endereço de entrega: ");
    console.log(`Endereço de entrega definido: ${endereco}`);
    return endereco;
}

module.exports = {
    definirEnderecoEntrega
};