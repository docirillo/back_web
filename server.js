/* 
    Obtendo as dependências:
    config     Arquivo de configurações do nosso app
    express    Framework web rápido, flexível e minimalista para Node.js
    bodyParser Módulo capaz de converter o body da requisição para vários formatos, entre eles o JSON
    mongoose   Módulo para conexão ao MongoDB
*/
const config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Definindo como iremos dar o parse em nossas requisições (requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Habilitando CORS para todos os métodos HTTP
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Conectando ao MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.urlMongodbLocal, {
    //Configurações para evitar os erros de deprecated functions (funções descontinuadas)
    useNewUrlParser: true, //Atribuímos para utilizar o novo Parser de URL
    useUnifiedTopology: true,
    useCreateIndex: true, //Como a função ensureIndex() está descontinuada, iremos forçar para ele utilizar o CreateIndex.
    useFindAndModify: false //Definimos como false para fazer com que o Mongoose utilize os métodos findOneAndUpdate() e findOneAndRemove() por padrão
}).then(() => {
    console.log("Conexão efetuada com sucesso ao MongoDB! :)");
}).catch(err => {
    console.log('Não foi possível estabelecer a conexão ao MongoDb :( Saindo...', err);
    process.exit();
});

// rota default /
app.get('/', (req, res) => {
    res.json({ "message": "Seja bem vindo a API " + config.nomeAPI + " versão " + config.versaoAPI });
});
// obtendo as demais rotas
require('./src/routes/contrato.routes.js')(app);

if (require.main === module) { // Verifica se foi executado diretamente via linha de comando. Ex: node server.js
    // Ouvindo na porta especificada
    app.listen(config.portaServidor, () => {
        console.log('Servidor Web está ouvindo na porta ' + config.portaServidor);
    });
}