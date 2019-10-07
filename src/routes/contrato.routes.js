module.exports = (app) => {
    const contratos = require('../controller/contrato.controller.js');

    // Cria um novo contrato
    app.post('/contratos', contratos.create)
    // Lista todos os contratos
    app.get('/contratos', contratos.findAll)
    //Lista apenas um contrato pelo ID
    app.get('/contratos/:contratoId', contratos.findOne)
    //Lista os contratos pelo texto
    app.get('/contratos/texto/:contratoTexto', contratos.findByTexto)
    //Altera um contrato existente pelo Id
    app.put('/contratos/:contratoId', contratos.update)
    //Apaga um contrato existente pelo Id
    app.delete('/contratos/:contratoId', 
                contratos.delete) 
}