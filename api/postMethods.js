const postMethods = module.exports //instancia a exportacao de metodo para uma constante, assim, sempre que chamada, retornara um modulo
const conn = require('../db') //resgata a conexao com o bd
const moment = require('moment') //modulo 'momentJS', relacionado à datas

const date   = moment().format("YYYY-MM-DD HH:mm"); //retorna a data atual formatando para: yyyy-mm-dd

postMethods.usuario = (req, res) => {
    conn.query("INSERT INTO usuario (nome, cpf, telefone) VALUES (?, ?, ?)", [req.query.nome, req.query.cpf, req.query.telefone], (err, result, field) => { //query que insere um usuario no bd
        if (err) return console.log(err)
        res.json(result.insertId) //retorna um json com o id do usuario cadastrado
    })
}

postMethods.favorecido = (req, res) => {
    conn.query("INSERT INTO favorecido (usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id) VALUES (?, ?, ?, ?)", [req.query.usuario_id, req.query.usuario_conta_id, req.query.favorecido_id, req.query.favorecido_conta_id], (err, result, field) => { //query que insere um favorecido no bd, com os dados do usuario/conta e do usuario/favorecido/conta
        if (err) return console.log(err)
        res.json(result.insertId) //retorna um json com o id do favorecido cadastrada
    })
}

postMethods.conta = (req, res) => {
    conn.query("INSERT INTO conta (saldo, limite, usuario_id) VALUES (?, ?, ?)", [req.query.saldo, 500, req.query.usuario_id], (err, result, field) => { //query que insere uma conta de um determinado usuario no bd
        if (err) return console.log(err)
        res.json(result.insertId) //retorna um json com os id da conta cadastrada
    })
}

postMethods.transferencia = (req, res) => {//metodo responsavel por realizar uma transferencia
    //Instancia as variaveis, facilitando a chamada das variáveis
    let descricao           = req.query.descricao 
    let valor               = parseFloat(req.query.valor)
    let usuario_id          = req.query.usuario_id
    let usuario_conta_id    = req.query.usuario_conta_id
    let favorecido_id       = req.query.favorecido_id
    let favorecido_conta_id = req.query.favorecido_conta_id

    conn.query("SELECT saldo, limite FROM conta WHERE id = ?", req.query.usuario_conta_id, (err, result) => {
        if(err) return console.log(err)
        let dadosConta = result[0]
        let saldoTotal = parseFloat(dadosConta.saldo) + parseFloat(dadosConta.limite)
        if (valor <= saldoTotal) {
            conn.query(`SELECT id FROM transferencia WHERE usuario_id = ? AND usuario_conta_id = ? AND favorecido_id = ? AND favorecido_conta_id = ? AND valor = ? AND '${date}' < DATE_ADD(data_cadastro, INTERVAL 2 MINUTE) ORDER BY id DESC LIMIT 1`, [usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, valor], (err, result, field) => {
                if(err) return console.log(err)
                if(result.length) {
                    let lastTransacao = result[0].id
                    conn.query("UPDATE transferencia SET status = 'CANCELADO' WHERE id = ?", lastTransacao, (err, result) => {
                        if (err) return console.log(err)
                        conn.query("INSERT INTO transferencia (descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, 'APROVADO'], (err, result) => {
                            if (err) return console.log(err)
                            res.json(result.insertId)
                        })
                    })
                } else {
                    conn.query(`UPDATE conta SET saldo = (Quantidade - ${valor}) WHERE id = ?`, usuario_conta_id, (err, result) => {
                        if(err) return console.log(err)
                        conn.query(`UPDATE conta SET saldo = (Quantidade + ${valor}) WHERE id = ?`, favorecido_conta_id, (err, result) => {
                            if(err) return console.log(err)
                            conn.query("INSERT INTO transferencia (descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, 'APROVADO'], (err, result) => {
                                if (err) return console.log(err)
                                res.json(result.insertId)
                            })
                        })
                    })
                }
            })
        } else {
            res.json({ error: 'saldo indisponivel' })
        }
    })
}