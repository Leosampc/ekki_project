const postMethods = module.exports //instancia a exportacao de metodo para uma constante, assim, sempre que chamada, retornara um modulo
const conn = require('../db') //resgata a conexao com o bd
const moment = require('moment') //modulo 'momentJS', relacionado à datas

const date   = moment().format("YYYY-MM-DD HH:mm"); //retorna a data atual formatando para: yyyy-mm-dd

postMethods.usuario = (req, res) => {
    conn.query("INSERT INTO usuario (nome, cpf, telefone) VALUES (?, ?, ?)", [req.body.nome, req.body.cpf, req.body.telefone], (err, result, field) => { //query que insere um usuario no bd
        if (err) return console.log(err)
        res.json(result.insertId) //retorna um json com o id do usuario cadastrado
    })
}

postMethods.favorecido = (req, res) => {
    conn.query("INSERT INTO favorecido (usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id) VALUES (?, ?, ?, ?)", [req.body.usuario_id, req.body.usuario_conta_id, req.body.favorecido_id, req.body.favorecido_conta_id], (err, result, field) => { //query que insere um favorecido no bd, com os dados do usuario/conta e do usuario/favorecido/conta
        if (err) return console.log(err)
        res.json(result.insertId) //retorna um json com o id do favorecido cadastrada
    })
}

postMethods.conta = (req, res) => {
    conn.query("INSERT INTO conta (saldo, limite, usuario_id) VALUES (?, ?, ?)", [req.body.saldo, 500, req.body.usuario_id], (err, result, field) => { //query que insere uma conta de um determinado usuario no bd
        if (err) return console.log(err)
        res.json(result.insertId) //retorna um json com os id da conta cadastrada
    })
}

postMethods.transferencia = (req, res) => {//metodo responsavel por realizar uma transferencia
    //Instancia as variaveis, facilitando a chamada das variáveis
    let descricao           = req.body.descricao 
    let valor               = parseFloat(req.body.valor)
    let usuario_id          = req.body.usuario_id
    let usuario_conta_id    = req.body.usuario_conta_id
    let favorecido_id       = req.body.favorecido_id
    let favorecido_conta_id = req.body.favorecido_conta_id

    conn.query("SELECT saldo, limite FROM conta WHERE id = ?", req.body.usuario_conta_id, (err, result) => { //retorna o saldo e o limite pelo id da conta
        if(err) return console.log(err)
        let dadosConta = result[0]
        let message = ""
        let saldoTotal = parseFloat(dadosConta.saldo) + parseFloat(dadosConta.limite) //soma o saldo com o limite para dar o valor total de possibilidade de transacao
        if (valor <= saldoTotal) { //caso o valor total de saldo seja maior que o valor da transferencia
            conn.query(`SELECT id FROM transferencia WHERE usuario_id = ? AND usuario_conta_id = ? AND favorecido_id = ? AND favorecido_conta_id = ? AND valor = ? AND '${date}' < DATE_ADD(data_cadastro, INTERVAL 2 MINUTE) ORDER BY id DESC LIMIT 1`, [usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, valor], (err, result, field) => {//seleciona a ultima transferencia do cliente, relacionando com a conta, o favorecido, a conta do favorecido, o valor da transferencia e data em que foi realizada (caso a data seja igual ou menor que 2 minutos em relação ao tempo atual)
                if(err) return console.log(err)
                if(result.length) {//caso possua uma transferencia 
                    let lastTransacao = result[0].id //resgata o id
                    conn.query("UPDATE transferencia SET status = 'CANCELADO' WHERE id = ?", lastTransacao, (err, result) => {//cancela a transferencia
                        if (err) return console.log(err)
                        conn.query("INSERT INTO transferencia (descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, 'APROVADO'], (err, result) => {//realiza uma nova transferencia sem alterar o saldo de ambas as partes (cliente - favorecido)
                            if (err) return console.log(err)
                            res.json(result.insertId)
                        })
                    })
                } else { //caso nao possua transferencia
                    conn.query(`UPDATE conta SET saldo = (saldo - ${valor}) WHERE id = ?`, usuario_conta_id, (err, result) => { //debita o valor do usuario
                        if(err) return console.log(err)
                        conn.query(`UPDATE conta SET saldo = (saldo + ${valor}) WHERE id = ?`, favorecido_conta_id, (err, result) => { //adiciona o valor no favorecido
                            if(err) return console.log(err)
                            conn.query("INSERT INTO transferencia (descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [descricao, valor, usuario_id, usuario_conta_id, favorecido_id, favorecido_conta_id, 'APROVADO'], (err, result) => { //insere o registro da transferencia
                                if (err) return console.log(err)
                                if ((parseFloat(dadosConta.saldo) - parseFloat(valor)) < 0) { //caso o saldo da conta tenha ficado negativo, envia a mensagem "limite", para orientar a requisicao de que o limite da conta foi utilizado
                                    message = "limite"
                                }
                                res.json({ result: result.insertId, message })
                            })
                        })
                    })
                }
            })
        } else { //caso contrario emite a mensagem de saldo indisponivel
            res.json({ error: 'Saldo indisponivel, favor verificar novamente.' })
        }
    })
}