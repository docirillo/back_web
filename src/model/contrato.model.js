const mongoose = require('mongoose');

//Criando o Schema do Contrato
const ContratoSchema = mongoose.Schema({
    nome: {
        type: String,
        minlength: [2, 'O nome é muito curto'],
        maxlength: [100, 'O nome é muito longo'],
        required: [true, 'O nome do contrato é obrigatório']
    },
    descricao: {
        type: String,
        maxlength: [1000, 'A descrição é muito longa'],
        required: false
    },
    numeroNota: Number,
    valor: Number,
    dataEmissao: Date,
    dataAssinatura: Date,
    dataVencimento: Date
});
/*
Definindo um índice para o texto
*/
ContratoSchema.index({
    nome: 'text',
    descricao: 'text',
    
});

module.exports = mongoose.model('Contratos', ContratoSchema);