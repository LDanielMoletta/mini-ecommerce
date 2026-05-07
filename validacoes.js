// Este arquivo será uma caixa de ferramentas para checar se os dados que o sistema recebe fazem sentido.
//I. Crie uma função chamada isNumeroValido(valor). Ela deve receber uma variável e retornar true se for um número válido (e maior ou igual a zero) ou false caso contrário. A lógica de como checar isso é com você!
//II. Crie uma função chamada isTextoValido(texto). Ela deve verificar se o texto existe e não é apenas um monte de espaços em branco. Deve retornar true ou false.
// fazer com que essas funções sejam exportadas para que possam ser usadas em outros arquivos do projeto. Lembre-se de usar module.exports para isso. 
// vai se comunicar com o arquivo app.js
//III. Exporte as duas funções no final do arquivo.

function isNumeroValido(valor) {
    return typeof valor === 'number' && !isNaN(valor) && valor >= 0;
}

function isTextoValido(texto) {
    return typeof texto === 'string' && texto.trim().length > 0;
}

module.exports = {
    isNumeroValido,
    isTextoValido
};

