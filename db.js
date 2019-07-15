const mysql = require('mysql') //dependencia do mysql do npm
const connection = mysql.createConnection({ //criando a conexao e passando os parametros de auth
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'db_ekki'
})

connection.connect(function (err) { //executando a conexao
    if (err) return console.log(err); //caso de erro, retorna
    console.log('conectou!');
})

module.exports = connection //exportando a conexao