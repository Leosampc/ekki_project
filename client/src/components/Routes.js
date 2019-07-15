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

class Routes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usuario: [],
      contas: [], 
      extrato: [],
      favorecidos: [],
      selectedConta: 0,
    }
    this.changeConta = this.changeConta.bind(this)
    this.getLatestExtrato = this.getLatestExtrato.bind(this)
    this.getFavorecidos = this.getFavorecidos.bind(this)
    this.refreshData = this.refreshData.bind(this)
  }

  componentDidMount() {
    axios.get(`/api/usuario/${id_user}/${token}`)
      .then(res => {
        this.setState({ usuario: res.data }, (state) => {
          axios.get(`/api/conta/usuario/${this.state.usuario.id}/${token}`)
            .then(res => {
              this.setState({ contas: res.data }, () => {
                this.getLatestExtrato(this.state.contas[this.state.selectedConta])
                this.getFavorecidos(this.state.usuario)
              })
              this.props.setUsuario(this.state.usuario)
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
  }

  refreshData = () => {
    axios.get(`/api/conta/usuario/${this.state.usuario.id}/${token}`)
      .then(res => {
        this.setState({ contas: res.data }, () => {
          this.getLatestExtrato(this.state.contas[this.state.selectedConta])
          this.getFavorecidos(this.state.usuario)
          console.log(this.state)
        })
        this.props.setUsuario(this.state.usuario)
      })
      .catch(err => {
        console.log(err)
      })
  }

  changeConta(e) {
    this.setState({ selectedConta: e.target.value }, () => {
      this.getLatestExtrato(this.state.contas[this.state.selectedConta])
    })
  }

  getLatestExtrato (conta) {
    axios.get(`/api/transferencias/${conta.id}/desc/10/${token}`)
      .then(res => {
        this.setState({ extrato: res.data })
      })
      .catch(err => {
        console.log(err)
      })
  }

  getFavorecidos (usuario) {
    axios.get(`/api/favorecidos/${usuario.id}/${token}`)
      .then(res => {
        this.setState({ favorecidos: res.data })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <Switch>
        <Route path='/' exact 
          render={() => <DashboardPage usuario={this.state.usuario} contas={this.state.contas} conta={this.state.selectedConta} changeConta={this.changeConta} extrato={this.state.extrato} /> } 
        />
        <Route path='/dashboard' exact 
          render={() => <DashboardPage usuario={this.state.usuario} contas={this.state.contas} conta={this.state.selectedConta} changeConta={this.changeConta} extrato={this.state.extrato} /> } 
        />
        <Route path='/favorecidos' render={() => <FavorecidosPage usuario={this.state.usuario} pagina="Favorecidos" contas={this.state.contas} conta={this.state.selectedConta} changeConta={ this.changeConta } favorecidos={this.state.favorecidos} deleteFavorecidoById={this.deleteFavorecidoById} getFavorecidos={this.getFavorecidos} />} />
        <Route path='/extrato' render={ () => <ExtratoPage  usuario={this.state.usuario} contas={this.state.contas} conta={this.state.selectedConta} changeConta={this.changeConta} /> } />


        <Route path='/transferencia' render={() => <TransferenciaPage usuario={this.state.usuario} pagina="Transferencia" contas={this.state.contas} conta={this.state.selectedConta} changeConta={ this.changeConta } favorecidos={this.state.favorecidos} refreshData={this.refreshData} />} />
        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
