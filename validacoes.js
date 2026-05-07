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

