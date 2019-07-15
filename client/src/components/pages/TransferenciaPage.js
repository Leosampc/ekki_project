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

  setStateModal(name, status) { //exibe ou esconde um modal
    this.setState({ [name] : status })
  }

  changeFavorecido(e) { //atualiza o estado da variavel do favorecido selecionado e preenche os demais inputs com os dados resgatados
    let index = e.target.value //valor do option
    let favorecido = this.props.favorecidos[index] //retorna o favorecido pelo index armazenado anteriormente, que faz referencia a posicao do favorecido no array de favorecidos
    this.setState({ favorecido: favorecido.favorecido_id, favorecido_nome: favorecido.favorecido, favorecido_conta: favorecido.favorecido_conta_id, conta: favorecido.usuario_conta_id, valorTransferencia: "", displayFinalForm: 'block' })
  }

  changeValor(event) { //atualiza o valor de um input
    let inputName = event.target.name //nome do input
    let inputValue = event.target.value //valor do input
    let lastValueChar = ((parseInt(inputValue.slice(-1)) >= 0 && parseInt(inputValue.slice(-1)) < 10) || inputValue.slice(-1) == ".") ? inputValue.slice(-1) : "" //caso seja um numero ou um ponto ".", atribui o mesmo a variavel, caso contrario deixa-a vazia
    if ((lastValueChar == "" || (lastValueChar == "." && parseInt(this.state.valorTransferencia.indexOf(".")) > -1)) && inputName == "valorTransferencia") { //caso a variavel criada anteriormente esteja vazia OU seja um ponto "." e o input do valor ja tenha ponto, nao atualiza o estado da variavel
      return false
    }
    this.setState({
      [inputName]: inputValue
    })
  }

  submitForm(event) { //envia o formulario
    event.preventDefault(); //pausa a execucao automatica do formulario
    let usuario_id = this.props.usuario.id
    if (parseFloat(this.state.valorTransferencia) > 0 && this.state.descricaoTransferencia.trim().length > 1) { //se o valor da transferencia for positivo e a possuir alguma descricao da transacao
      axios.post(`/api/transferencia/${token}`, { //envia os dados para cadastro da transferencia, por post
        descricao: this.state.descricaoTransferencia,
        valor: parseFloat(this.state.valorTransferencia),
        usuario_id: usuario_id,
        usuario_conta_id: this.state.conta,
        favorecido_id: this.state.favorecido,
        favorecido_conta_id: this.state.favorecido_conta,
      })
        .then(res => {
          if(res.data.error) { //se possuir algum erro, exibe o modal de erro com a mensagem
            this.setState({ modalErroMensagem: res.data.error }, () => {
              this.setStateModal("modalErro", true)
            })
            return false
          } else {//caso nao possuam erros
            if(res.data.message && res.data.message == "limite") { //se possuir a mensagem do limite, exibe o modal com a mensagem que o limite teve que ser utilizado
              this.setState({ modalErroMensagem: "Foi utilizado o limite para realizar a transacao." }, () => {
                this.setStateModal("modalErro", true)
              })
            }
            this.props.refreshData() //metodo que atualiza as variaveis de estado da aplicacao para manter o fluxo correto
          }
        })
        .catch(err => {
          console.log(err)
        })
    } else { //caso o valor esteja errado ou a descricao em branco
      this.setState({
        modalErroMensagem: "Campos em branco ou errados, favor tentar novamente."
      }, () => {
        this.setStateModal("modalErro", true)
      })
    }
  }
  
  render() {
    if (this.props.contas.length == 0) { //caso os dados das contas, recebidas por props ainda nao tenham carregado
      return (
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      )
    } else {//quando carrega
      let saldo = parseFloat(this.props.contas[this.props.conta].saldo)
      let limite = parseFloat(this.props.contas[this.props.conta].limite)
      let disponivel = (saldo >= 0) ? 100 : 100 - parseInt((saldo * -1) / limite * 100) //calculo para verificar a porcentagem disponivel do limite da conta
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
                          icon="comment"
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
                      style={{ width: `${disponivel}%` }}></div>
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