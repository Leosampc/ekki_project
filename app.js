const app = require('./server') //chama as configuracoes globais do app
const router = require('./router') //chama o modulo de rotas

app.use('/api', router) //define a rota '/api' como padrao e passa o modulo de rotas por metodo

const port = process.env.PORT || 5000; //porta do server
app.listen(port, () => console.log(`Listening on port ${port}`));