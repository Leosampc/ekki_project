const deleteMethods = module.exports //instancia a exportacao de metodo para uma constante, assim, sempre que chamada, retornara um modulo
const conn = require('../db') //resgata a conexao com o bd
const moment = require('moment') //modulo 'momentJS', relacionado à datas

const date = moment().format("YYYY-MM-DD HH:mm"); //retorna a data atual formatando para: yyyy-mm-dd

deleteMethods.favorecido = (req, res) => {
    res.send(req.query.id)
    conn.query("DELETE FROM favorecido WHERE id = ?", req.query.id, (err, result, field) => { //query que insere um favorecido no bd, com os dados do usuario/conta e do usuario/favorecido/conta
        if (err) return console.log(err)
    })
}

