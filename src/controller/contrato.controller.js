//Obtendo o model do Contrato
const Contrato = require('../model/contrato.model.js');

//Criando um novo contrato
exports.create = (req, res) => {
    // Validando se veio algo junto a requisição
    if(!req.body) {
        
        return res.status(400).send({
            message: "Conteúdo para criar o contrato não pode estar vazio!"
        });
    }

    // Criando o contrato com os dados da requisição
    const contrato = new Contrato(req.body);

    // Salva o novo contrato no MongoDB
    contrato.save()
    .then(data => {
        res.send(data);
    }).catch(err => {        
        if(err.message.indexOf('duplicate key error') !== -1){
            res.status(500).send({
                message: "O código de barras informado já existe na base de dados." ||  err.message 
            });
        } else
        res.status(500).send({
            message: err.message || "Ocorreu algo errado ao salvar o novo contrato."
        });
    });
};

// Obtendo todos os contratos do banco de dados
exports.findAll = (req, res) => {
    Contrato.find()
    .sort({nome:1}) //para trazer em ordem descendente, passe -1    
    .then(contratos => {
        res.send(contratos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocorreu algo errado ao obter os contratos do Banco de Dados."
        });
    });
};

// Obtendo todos os contratos a partir do nome, descrição ou código de barra
exports.findByTexto = (req, res) => {
    const termo = req.params.cadastroTexto
    Contrato.find({
        $text: { $search: termo }, //iremos obter o termo a ser pesquisado e aplicá-lo em nosso índice.
      })
    .sort({nome:1}) //para trazer em ordem descendente, passe -1    
    .then(contratos => {
        res.send(contratos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocorreu algo errado ao obter os contratos do Banco de Dados."
        });
    });
};



// Localizar um único contrato a partir do ID
exports.findOne = (req, res) => {
    Contrato.findById(req.params.contratoId)
    .then(contrato => {
        if(!contrato) {
            return res.status(404).send({
                message: "Contrato não encontrado com o ID " + req.params.contratoId
            });            
        }
        res.send(contrato);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Contrato não encontrado com o ID " + req.params.contratoId
            });                
        }
        return res.status(500).send({
            message: "Aconteceu algo errado ao obter o Contrato com o id " + req.params.contratoId
        });
    });
};

// Alterando um contrato
exports.update = (req, res) => {
       // Validando se veio algo junto a requisição
    if(!req.body) {
        return res.status(400).send({
            message: "Conteúdo para alterar o contrato não pode estar vazio"
        });
    }

    // Localiza e alteramos os dados do contrato a partir do conteúdo da requisição
    Contrato.findByIdAndUpdate(req.params.cadastroId, 
        {
            nome:  req.body.nome,
            descricao: req.body.descricao,
            numeroNota: req.body.numeroNota,
            valor: req.body.valor,
            dataEmissao: req.body.dataEmissao,
            dataAssinatura: req.body.dataAssinatura,
            dataVencimento: req.body.dataVencimento
        }, {new: true}) //iremos trazer o resultado do novo registro alterado
    .then(contrato => {
        if(!contrato) {
            return res.status(404).send({
                message: "Contrato não encontrado com o Id " + req.params.cadastroId
            });
        }
        res.send(contrato);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Contrato não encontrado com o Id " + req.params.cadastroId
            });                
        }
        return res.status(500).send({
            message: "Aconteceu algo errado ao tentar alterar o contrato com o Id " + req.params.cadastroId
        });
    });
};

// Apaga um determinado contrato a partir do ID passado
exports.delete = (req, res) => {    
    Contrato.findByIdAndRemove(req.params.cadastroId)
    .then(contrato => {
        if(!contrato) {
            return res.status(404).send({
                message: "Contrato não encontrado com o Id " + req.params.cadastroId
            });
        }
        res.send({message: "Contrato removido com sucesso!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Contrato não encontrado com o Id " + req.params.cadastroId
            });                
        }
        return res.status(500).send({
            message: "Não foi possível apagar o contrato com o Id " + req.params.cadastroId
        });
    });
};
