const express = require('express')
const md5 = require('md5') //modulo do md5
const router = express.Router() //instancia o metodo Router do modulo do express
const apiMethods = require('./api/methods') //resgata os metodos da api

const date  = new Date().toISOString().slice(0, 10); //retorna a data atual e remove os caracteres extras, formatando para: yyyy-mm-dd
const token = md5(date) //gera um md5 com a string da data formatada
const error = { error: 'token invalido' } //objeto com a mensagem de erro

router.get('/user/:id/:token', (req, res) => {//rota para retornar um usuario especifico
    if(req.params.token && req.params.token == token) {//caso o token seja valido
        apiMethods.usuario(req, res) //chama o metodo "usuario" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
        
})

router.get('/favorecidos/:usuario_id/:token', (req, res) => {//rota para retornar os favorecidos de um usuario especifico
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        apiMethods.favorecidos(req, res)//chama o metodo "favorecidos" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
        
})

router.get('/transferencias/:token', (req, res) => {//rota para retornar todas as transferencias do bd
    if (req.params.token && req.params.token == token) {//caso o token seja valido
        apiMethods.transferencias(req, res)//chama o metodo "transferencias" e envia o req e res por parametro
    } else {//caso seja invalido retornará o objeto de erro
        res.json(error)
    }
        
})

module.exports = router; //exporta o modulo router