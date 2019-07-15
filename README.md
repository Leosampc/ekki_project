# Banco Ekki - React/Node App

Esse projeto foi criado com a intenção de desenvolver uma pequena aplicação para um banco.

## Como executar esse projeto

1. Clonar o repositório e ir até o diretório
2. Configurar o banco de dados para suprir a aplicação
3. Instalar as dependências da aplicação

```
git clone https://github.com/Leosampc/ekki_project.git
cd ekki_project
npm install
cd client/
npm install

```

Depois disso, é necessário ter um servidor (pode ser local) que possua **mysql** instalado (ou instale manualmente). Com o servidor e o mysql já em execução, crie um banco de dados chamado **db_ekki** e faça o upload do arquivo **db_ekki.sql (localizado em ekki_project/_db_dump/)** no banco de dados recém criado no servidor. Com o banco de dados em execução, precisamos configurar as credenciais da conexão com o mysql na api. Acesse o arquivo **db.js**, localizado no diretório raiz **(ekki_project/)** da aplicação, e edite as credenciais conforme os seus dados.

O arquivo é aparentemente assim:

```javascript
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost', //o seu host
    port: 3306, //porta do mysql
    user: 'root', //usuario do mysql
    password: 'root', //senha do mysql
    database: 'db_ekki' //banco de dados relacionado, no nosso caso, o banco recém criado
})

connection.connect(function (err) {
    if (err) return console.log(err);
    console.log('conectou!');
})

module.exports = connection
```

Com os passos anteriores executados corretamente, acessamos a raiz do nosso projeto (**./ekki_project/**) e podemos iniciar a aplicação.

```
npm run dev

```

*Obs:* No arquivo **./ekki_project/client/package.json**, foi adicionado um atributo chamado **proxy**, que aponta para o host da API. Isso define com que as requisições http da nossa aplicação sejam todas feitas à partir do **host do back-end**. Caso você utilize outro host para hospedar a aplicação do back-end, **é necessário alterar essa linha do arquivo**. 

*Obs:* No arquivo **./ekki_project/package.json**, foram adicionados **3 comandos** no atributo **scripts**:
 * **client**: acessa o diretório ./ekki_project/client/ e starta a aplicação react com o comando **npm start**
 * **server**: executa o comando **nodemon app.js** e starta a aplicação do back-end
 * **client**: utiliza a biblioteca **concurrently (instalado com as dependencias da aplicacao)** para executar os 2 comandos anteriores e rodar a aplicação em um único terminal, simultâneamente.

```
```
Como a aplicação ***não possui*** funcionalidades para cadastrar usuarios e contas, os mesmos devem ser inseridos **manualmente** no bd. Para alterar o usuário "logado" no sistema, é necessário alterar a **linha 15** do arquivo *./ekki_project/client/src/components/Routes.js* para o id do usuário relacionado.

```javascript
import React from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import FavorecidosPage from './pages/FavorecidosPage'
import ExtratoPage from './pages/ExtratoPage'
import TransferenciaPage from './pages/TransferenciaPage'

const md5 = require('md5')

const todayDate = new Date().toISOString().slice(0, 10);
const token = md5(todayDate)

const id_user = 1; //id do usuário logado
```

```
```

## Pacotes/modulos utilizados no back-end (NodeJS)

* **body-parser**: Modulo que converte o body de uma requisição em varios formatos. Ex: json.
* **express**: Framework flexivel para o nodejs que fornece um conjunto de diversos recursos para a aplicação.
* **md5**: Biblioteca para converter uma string em md5.
* **moment**: O Moment.js é um pacote open source que pode ser utilizado para validar, manipular e fazer o parse de datas no JavaScript de uma maneira muito poderosa.
* **mysql**: Modulo para executar a conexao com o nosso banco de dados.

```
```

## Pacotes/modulos utilizados no front-end (ReactJS)

* **axios**: Faz requisições assyncronas para a API.
* **md5**: Biblioteca para converter uma string em md5.
* **mdbreact**: Pacote com diversos componentes de template (Buttons, Elementos, etc).
* **react-datepicker**: Executa um datepicker à partir de um input, facilitando a inserção de datas.
* **react-router-dom**: Gerencia as rotas da aplicação.


