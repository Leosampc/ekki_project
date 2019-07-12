const express = require('express'); //dependencia global do express
const app = express(); //instancia o express
const bodyParser = require('body-parser') //body-parser para gerenciar o body das requisicoes

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) //habilita o json no body-parser

module.exports = app