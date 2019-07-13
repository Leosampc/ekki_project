import React from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import TablesPage from './pages/TablesPage'
import MapsPage from './pages/MapsPage'
import NotFoundPage from './pages/NotFoundPage'

const md5 = require('md5')

const todayDate = new Date().toISOString().slice(0, 10);
const token = md5(todayDate)

class Routes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usuario: [],
      contas: [], 
      extrato: [],
      selectedConta: 0 
    }
    this.changeConta = this.changeConta.bind(this)
    this.getLatestExtrato = this.getLatestExtrato.bind(this)
  }

  componentDidMount() {
    axios.get(`/api/usuario/1/${token}`)
      .then(res => {
        this.setState({ usuario: res.data }, (state) => {
          axios.get(`/api/conta/${this.state.usuario.id}/${token}`)
            .then(res => {
              this.setState({ contas: res.data }, () => {
                this.getLatestExtrato(this.state.contas[this.state.selectedConta])
              })
              this.props.setUsuario(this.state.usuario)
            })
            .catch(err => {
              console.log(err)
            })
        })
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

  render() {
    return (
      <Switch>
        <Route path='/' exact 
          render={() => <DashboardPage usuario={this.state.usuario} contas={this.state.contas} conta={this.state.selectedConta} changeConta={this.changeConta} extrato={this.state.extrato} /> } 
        />
        <Route path='/dashboard' exact 
          render={() => <DashboardPage usuario={this.state.usuario} contas={this.state.contas} conta={this.state.selectedConta} changeConta={this.changeConta} extrato={this.state.extrato} /> } 
        />
        <Route path='/profile' component={ProfilePage} />
        <Route path='/tables' component={TablesPage} />
        <Route path='/maps' component={MapsPage} />
        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
