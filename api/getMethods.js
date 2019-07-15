const getMethods = module.exports //instancia a exportacao de metodo para uma constante, assim, sempre que chamada, retornara um modulo
const conn = require('../db') //resgata a conexao com o bd

getMethods.usuario = (req, res) => {
    conn.query("SELECT * FROM usuario WHERE id = ?", req.params.id, (err, result, field) => { //query que seleciona o usuario pelo id
        if(err) return console.log(err)
        res.json(result[0]) //retorna um json com os dados do usuario
    })
}

getMethods.usuarioByNome = (req, res) => {
    conn.query("SELECT * FROM usuario WHERE nome = ?", req.params.nome, (err, result, field) => { //query que seleciona o usuario pelo id
        if (err) return console.log(err)
        res.json(result[0]) //retorna um json com os dados do usuario
    })
}

getMethods.contasByUsuarioId = (req, res) => {
    conn.query("SELECT * FROM conta WHERE usuario_id = ?", req.params.usuario_id, (err, result) => { //query que seleciona as contas de um usuario
        if(err) return console.log(err)
        res.json(result) //retorna um array de objetos com os dados das contas do usuario relacionado
    })
}

getMethods.contaById = (req, res) => {
    conn.query("SELECT * FROM conta WHERE id = ?", req.params.id, (err, result) => { //query que seleciona uma determinada conta pelo id
        if (err) return console.log(err)
        res.json(result) //retorna um json com os dados da conta relacionada
    })
}

getMethods.favorecidos = (req, res) => {
    conn.query("SELECT f.id, f.usuario_id, f.usuario_conta_id, f.favorecido_id, f.favorecido_conta_id, u.nome AS 'usuario', fu.nome AS 'favorecido', DATE_FORMAT(f.data_cadastro, '%d/%m/%Y') AS 'data_cadastro' FROM favorecido f INNER JOIN usuario u ON f.usuario_id = u.id INNER JOIN usuario fu ON f.favorecido_id = fu.id WHERE usuario_id = ?", req.params.usuario_id, (err, result, field) => { //query que seleciona todos os favorecidos de um determinado usuario pelo id do usuario
        if(err) return console.log(err)
        res.json(result) //retorna um array de objetos com todos os favorecidos do usuario relacionado
    })
}

getMethods.transferencias = (req, res) => {
    conn.query("SELECT t.id, t.descricao, t.valor, t.usuario_id, t.usuario_conta_id, u.nome AS 'usuario', t.favorecido_id, t.favorecido_conta_id, fu.nome AS 'favorecido', t.status, DATE_FORMAT(t.data_cadastro, '%d/%m/%Y') AS 'data_cadastro' FROM transferencia t INNER JOIN usuario u ON t.usuario_id = u.id INNER JOIN usuario fu ON t.favorecido_id = fu.id", (err, result, field) => { //query que seleciona todas as transferencias cadastradas no bd
        if (err) return console.log(err)
        res.json(result) //retorna um array de objetos com todas as transferencias do bd
    })
}

getMethods.transferenciasByUsuarioId = (req, res) => {
    conn.query("SELECT t.id, t.descricao, t.valor, t.usuario_id, t.usuario_conta_id, u.nome AS 'usuario', t.favorecido_id, t.favorecido_conta_id, fu.nome AS 'favorecido', t.status, DATE_FORMAT(t.data_cadastro, '%d/%m/%Y') AS 'data_cadastro' FROM transferencia t INNER JOIN usuario u ON t.usuario_id = u.id INNER JOIN usuario fu ON t.favorecido_id = fu.id WHERE t.usuario_id = ?", req.params.usuario_id, (err, result, field) => { //query que seleciona todas as trasferencias de um determinado usuario pelo id do usuario
        if (err) return console.log(err)
        res.json(result) //retorna um array de objetos com todas as transferencias do usuario relacionado
    })
}

getMethods.transferenciasByContaId = (req, res) => {
    let order_limit = (req.params.order && req.params.limit) ? `ORDER BY t.id ${req.params.order} LIMIT ${req.params.limit}` : ""

    conn.query(`SELECT t.id, t.descricao, t.valor, t.usuario_id, t.usuario_conta_id, u.nome AS 'usuario', t.favorecido_id, t.favorecido_conta_id, fu.nome AS 'favorecido', t.status, DATE_FORMAT(t.data_cadastro, '%d/%m/%Y ás %H:%i') AS 'data_cadastro' FROM transferencia t INNER JOIN usuario u ON t.usuario_id = u.id INNER JOIN usuario fu ON t.favorecido_id = fu.id WHERE t.usuario_conta_id = ? ${order_limit}`, req.params.conta_id, (err, result, field) => { //query que seleciona todas as trasferencias de um determinado usuario pelo id da conta
        if (err) return console.log(err)
        res.json(result) //retorna um array de objetos com todas as transferencias do usuario relacionado
    })
}

getMethods.transferenciasByDateRange = (req, res) => {
    let startDate = req.params.start_date.replace("_", "-").replace("_", "-")
    let endDate  = req.params.end_date.replace("_", "-").replace("_", "-")
    stringDate = (startDate == endDate) ?` = DATE('${startDate}')` : ` BETWEEN '${startDate}' AND '${endDate}'`

    conn.query(`SELECT t.id, t.descricao, t.valor, t.usuario_id, t.usuario_conta_id, u.nome AS 'usuario', t.favorecido_id, t.favorecido_conta_id, fu.nome AS 'favorecido', t.status, DATE_FORMAT(t.data_cadastro, '%d/%m/%Y ás %H:%i') AS 'data_cadastro' FROM transferencia t INNER JOIN usuario u ON t.usuario_id = u.id INNER JOIN usuario fu ON t.favorecido_id = fu.id WHERE t.usuario_conta_id = ? AND DATE(t.data_cadastro) ${stringDate}`, req.params.conta_id, (err, result, field) => { //query que seleciona todas as trasferencias de um determinado usuario e conta pela data
        if (err) return console.log(err)
        res.json(result) //retorna um array de objetos com todas as transferencias do usuario relacionado
    })
}