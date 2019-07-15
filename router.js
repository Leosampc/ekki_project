const express = require('express')
const md5 = require('md5') //modulo do md5
const router = express.Router() //instancia o metodo Router do modulo do express

const getMethods = require('./api/getMethods') //resgata os metodos get da api
const postMethods = require('./api/postMethods') //resgata os metodos post da api
const deleteMethods = require('./api/deleteMethods') //resgata os metodos delete da api

const date  = new Date().toISOString().slice(0, 10); //retorna a data atual e remove os caracteres extras, formatando para: yyyy-mm-dd
const token = md5(date) //gera um md5 com a string da data formatada
const error = { error: 'token invalido' } //objeto com a mensagem de erro

//METODOS GET (SELECIONA DO BD)

router.get('/usuario/:id/:token', (req, res) => {//rota para retornar um usuario especifico
    if(req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.usuario(req, res) //chama o metodo get "usuario" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
        
})

router.get('/usuario/nome/:nome/:token', (req, res) => { //rota para retornar um usuario especifico
    if (req.params.token && req.params.token == token) { //caso o token seja valido
        getMethods.usuarioByNome(req, res) //chama o metodo get "usuario" e envia o req e res por parametro
    } else { //caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

router.get('/conta/:id/:token', (req, res) => { //rota para retornar as contas de um usuario especifico
    if (req.params.token && req.params.token == token) { //caso o token seja valido
        getMethods.contaById(req, res) //chama o metodo get "conta" e envia o req e res por parametro
    } else { //caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

router.get('/conta/usuario/:usuario_id/:token', (req, res) => { //rota para retornar as contas de um usuario especifico
    if (req.params.token && req.params.token == token) { //caso o token seja valido
        getMethods.contasByUsuarioId(req, res) //chama o metodo get "conta" e envia o req e res por parametro
    } else { //caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

router.get('/favorecidos/:usuario_id/:token', (req, res) => {//rota para retornar os favorecidos de um usuario especifico
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.favorecidos(req, res)//chama o metodo get "favorecidos" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
        
})

router.get('/transferencias/:token', (req, res) => {//rota para retornar todas as transferencias do bd
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.transferencias(req, res)//chama o metodo get "transferencias" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
        
})

router.get('/transferencias/usuario/:usuario_id/:token', (req, res) => {//rota para retornar todas as transferencias do bd
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.transferenciasByUsuarioId(req, res)//chama o metodo get "transferencias" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

router.get('/transferencias/conta/:conta_id/:token', (req, res) => {//rota para retornar todas as transferencias do bd
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.transferenciasByContaId(req, res)//chama o metodo get "transferencias" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

router.get('/transferencias/:conta_id/:order/:limit/:token', (req, res) => {//rota para retornar todas as transferencias do bd com limite de busca
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.transferenciasByContaId(req, res)//chama o metodo get "transferencias" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

router.get('/transferencias/date/:conta_id/:start_date/:end_date/:token', (req, res) => {//rota para retornar todas as transferencias do bd com limite de busca
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        getMethods.transferenciasByDateRange(req, res)//chama o metodo get "transferencias" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }

})

//METODOS POST (INSERCAO NO BD)

router.post('/usuario/:token', (req, res) => {
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        postMethods.usuario(req, res) //chama o metodo post "usuario" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
})

router.post('/favorecido/:token', (req, res) => {
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        postMethods.favorecido(req, res) //chama o metodo post "favorecidos" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
})

router.post('/conta/:token', (req, res) => {
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        postMethods.conta(req, res) //chama o metodo post "conta" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
})

router.post('/transferencia/:token', (req, res) => {
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        postMethods.transferencia(req, res) //chama o metodo post "transferencia" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
})

router.delete('/favorecido/:token', (req, res) => {
    if (req.params.token && req.params.token == token) { //caso o token seja valido
        deleteMethods.favorecido(req, res) //chama o metodo post "transferencia" e envia o req e res por parametro
    } else { //caso seja invalido retornará o objeto de erro
        res.json(error)
    }
})

module.exports = router; //exporta o modulo router