import React from 'react'
import axios from 'axios'
import { MDBRow, MDBCol, MDBView, MDBCard, MDBCardBody, MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BreadcrumSection from './sections/BreadcrumSection';

const moment = require('moment')

const md5 = require('md5')
const todayDate = new Date().toISOString().slice(0, 10);
const token = md5(todayDate)

class TransferenciaPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      tdInicial: 'block', //controla o estado de exibicao de uma td descritiva
      extrato: []
    }
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.getExtrato = this.getExtrato.bind(this);
  }

  handleChangeStart(date) { //seta a data inicial
    this.setState({
      startDate: date
    });
  }

  handleChangeEnd(date) { //seta a data final
    this.setState({
      endDate: date
    });
  }

  getExtrato() { //retorna o extrato baseado nas datas
    let startDate = moment(this.state.startDate).format("YYYY_MM_DD") //coloca "_" na string da data para que a mesma possa ser enviada por get sem quebrar o link
    let endDate = moment(this.state.endDate).format("YYYY_MM_DD") //coloca "_" na string da data para que a mesma possa ser enviada por get sem quebrar o link
    let conta = this.props.contas[this.props.conta] //recebe a conta selecionada
    axios.get(`/api/transferencias/date/${conta.id}/${startDate}/${endDate}/${token}`)
      .then(res => { //envia a requisicao das transacoes
        console.log(res.data)
        this.setState({extrato : res.data, tdInicial: 'none'})
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    let count = 1 //contador da tabela
    let tr = <tr><td colSpan="7"><center>Selecione as datas e clique em "buscar" para visualizar o seu extrato.</center></td></tr>
    if (this.state.extrato.length > 0) { //se o array de extratos possuir registros, altera o conteudo da variavel tr
      tr = this.state.extrato.map((arr, index) => { //metodo map para instanciar os objetos do array, 1 a 1
        return (
          <tr key={arr.id}>
            <td>{count++}</td>
            <td>{arr.usuario_conta_id}</td>
            <td>{arr.favorecido}</td>
            <td>{arr.favorecido_conta_id}</td>
            <td>{arr.descricao}</td>
            <td>R${parseFloat(arr.valor).toFixed(2)}</td>
            <td>{arr.data_cadastro}</td>
            <td>{arr.status}</td>
          </tr>
        )
      })
    }
    return (
      <React.Fragment>
        <BreadcrumSection page="Favorecidos" contas={this.props.contas} conta={this.props.conta} changeConta={this.props.changeConta} />
        <MDBCard className="mt-5">
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="12" lg="4">
                <DatePicker
                  customInput={<MDBInput
                    label="Data inicial"
                    icon="calendar-alt"
                    group
                    type="text"
                    readOnly
                  />}
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeStart}
                  dateFormat="dd/MM/yyyy"
                  withPortal
                />
              </MDBCol>
              <MDBCol md="12" lg="4">
                <DatePicker
                  customInput={<MDBInput
                    label="Data Final"
                    icon="calendar-alt"
                    group
                    type="text"
                    readOnly
                  />}
                  selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeEnd}
                  minDate={this.state.startDate}
                  dateFormat="dd/MM/yyyy"
                  withPortal
                />
              </MDBCol>
              <MDBCol md="12" lg="4">
                <MDBBtn outline color="primary" className="mt-3" onClick={this.getExtrato}>
                  Buscar <MDBIcon far icon="paper-plane" className="ml-2" />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard className="mt-5">
              <MDBView className="gradient-card-header blue darken-2">
                <h4 className="h4-responsive text-white">Extrato</h4>
              </MDBView>
              <MDBCardBody>
                <MDBTable hover responsive striped>
                  <MDBTableHead color="blue-grey lighten-4">
                    <tr>
                      <th>#</th>
                      <th>Conta</th>
                      <th>Favorecido</th>
                      <th>Conta Favorecido</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Data de Realização</th>
                      <th>Status</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {tr}
                  </MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </React.Fragment>
    )
  }
}

export default TransferenciaPage;