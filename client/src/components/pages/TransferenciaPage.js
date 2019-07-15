import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import axios from 'axios'
import { MDBCol, MDBRow, MDBIcon, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardText, MDBModal, MDBModalBody } from 'mdbreact';
import BreadcrumSection from './sections/BreadcrumSection';

const md5 = require('md5')

const todayDate = new Date().toISOString().slice(0, 10);
const token = md5(todayDate)

class TransferenciaPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: false,
      favorecido: "",
      favorecido_nome: "",
      favorecido_conta: "",
      conta: "",
      descricaoTransferencia: "",
      valorTransferencia: "",
      displayFinalForm: "none",
      modalErro: false,
      modalErroMensagem: ""

    }

    this.changeFavorecido = this.changeFavorecido.bind(this)
    this.changeValor = this.changeValor.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  setStateModal(name, status) {
    this.setState({ [name] : status })
  }

  changeFavorecido(e) {
    let index = e.target.value
    let favorecido = this.props.favorecidos[index]
    this.setState({ favorecido: favorecido.favorecido_id, favorecido_nome: favorecido.favorecido, favorecido_conta: favorecido.favorecido_conta_id, conta: favorecido.usuario_conta_id, valorTransferencia: "", displayFinalForm: 'block' })
  }

  changeValor(event) {
    let inputName = event.target.name
    let inputValue = event.target.value
    let lastValueChar = ((parseInt(inputValue.slice(-1)) >= 0 && parseInt(inputValue.slice(-1)) < 10) || inputValue.slice(-1) == ".") ? inputValue.slice(-1) : ""
    if ((lastValueChar == "" || (lastValueChar == "." && parseInt(this.state.valorTransferencia.indexOf(".")) > -1)) && inputName == "valorTransferencia") {
      return false
    }
    this.setState({
      [inputName]: inputValue
    })
  }

  submitForm(event) {
    event.preventDefault();
    let usuario_id = this.props.usuario.id
    if (parseFloat(this.state.valorTransferencia) > 0 || this.state.descricaoTransferencia.trim().length < 1) {
      axios.post(`/api/transferencia/${token}`, {
        descricao: this.state.descricaoTransferencia,
        valor: parseFloat(this.state.valorTransferencia),
        usuario_id: usuario_id,
        usuario_conta_id: this.state.conta,
        favorecido_id: this.state.favorecido,
        favorecido_conta_id: this.state.favorecido_conta,
      })
        .then(res => {
          if(res.data.error) {
            this.setState({ modalErroMensagem: res.data.error }, () => {
              this.setStateModal("modalErro", true)
            })
            return false
          } else {
            if(res.data.message && res.data.message == "limite") {
              this.setState({ modalErroMensagem: "Foi utilizado o limite para realizar a transacao." }, () => {
                this.setStateModal("modalErro", true)
              })
            }
            this.props.refreshData()
          }
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      this.setState({
        modalErroMensagem: "Campos em branco ou errado, favor tentar novamente."
      }, () => {
        this.setStateModal("modalErro", true)
      })
    }
  }
  
  render() {
    if (this.props.contas.length == 0) {
      return <div>teste</div>
    } else {
      let saldo = parseFloat(this.props.contas[this.props.conta].saldo)
      let limite = parseFloat(this.props.contas[this.props.conta].limite)
      let disponivel = (saldo >= 0) ? 100 : parseInt((saldo * -1) / limite * 100)
      return (
        <React.Fragment>
          <BreadcrumSection page="Favorecidos" contas={this.props.contas} conta={this.props.conta} changeConta={this.props.changeConta} />
          <MDBRow>
            <MDBCol md="8">
              <MDBCard>
                <MDBCardBody>
                  <form  onSubmit={this.submitForm}>
                    <p className="h4 text-center py-4">Transferencia bancaria</p>
                    <div className="grey-text">
                      <select  defaultValue={'DEFAULT'} className="browser-default custom-select" icon="envelope" onChange={this.changeFavorecido}>
                        <option value="DEFAULT" disabled>Selecione o seu favorecido</option>
                        {
                          this.props.favorecidos.map((arr, index) => {
                            return <option key={arr.id} value={index}>{arr.favorecido} - Numero da Conta: {arr.favorecido_conta_id}</option>
                          })
                        }
                      </select>
                      <hr></hr>
                      <MDBInput
                        label="Sua Conta"
                        icon="address-card"
                        group
                        type="text"
                        validate
                        readOnly
                        value={this.state.conta}
                      />
                      <MDBInput
                        label="Favorecido"
                        icon="user"
                        group
                        type="text"
                        validate
                        readOnly
                        value={this.state.favorecido_nome}
                      />
                      <MDBInput
                        label="Conta do Favorecido"
                        icon="address-card"
                        group
                        type="text"
                        validate
                        readOnly
                        value={this.state.favorecido_conta}
                      />
                      <div style={{ display: `${this.state.displayFinalForm}` }}>
                        <MDBInput
                          label="Descricao"
                          icon="hand-holding-usd"
                          group
                          type="text"
                          validate
                          name = "descricaoTransferencia"
                          value={this.state.descricaoTransferencia}
                          onChange={this.changeValor}
                        />
                        <MDBInput
                          label="Valor da transferencia (Ex: 1000.00)"
                          icon="hand-holding-usd"
                          group
                          type="text"
                          validate
                          name="valorTransferencia"
                          value={this.state.valorTransferencia}
                          onChange={this.changeValor}
                        />
                      </div>
                      
                    </div>
                    <div style={{ display: `${this.state.displayFinalForm}` }} className="text-center py-4 mt-3">
                      <MDBBtn color="cyan" type="submit">
                        Transferir <MDBIcon far icon="paper-plane" className="ml-1" />
                      </MDBBtn>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol xl="4" md="4" className="mb-r">
              <MDBCard className="cascading-admin-card">
                <div className="admin-up">
                  <MDBIcon icon="money-bill-alt" className="primary-color" />
                  <div className="data">
                    <p>SALDO</p>
                    <h4>
                      <strong>R${this.props.contas[this.props.conta].saldo.toFixed(2)}</strong>
                    </h4>
                  </div>
                </div>
                <MDBCardBody>
                  <div className="progress">
                    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg-primary" role="progressbar"
                      style={{ width: `${100 - disponivel}%` }}></div>
                  </div>
                  <MDBCardText>Limite da conta: R${this.props.contas[this.props.conta].limite.toFixed(2)} ({disponivel}%)</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBModal /* toggle={this.toggle(1)} */  isOpen={this.state.modalErro} position="top" frame>
            <MDBModalBody className="text-center">
            <span>{this.state.modalErroMensagem}</span>
            <MDBBtn color="secondary" onClick={() => this.setStateModal("modalErro", false)}>Ok</MDBBtn>
            </MDBModalBody>
          </MDBModal>
        </React.Fragment>
      )
    }
  }
}

export default TransferenciaPage;