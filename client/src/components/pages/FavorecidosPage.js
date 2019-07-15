import React from 'react'
import axios from 'axios'
import { MDBCard, MDBCol, MDBRow, MDBView, MDBModal, MDBModalBody, MDBModalHeader, MDBCardBody, MDBInput, MDBCardText, MDBCardFooter, MDBBtn, MDBIcon, MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import BreadcrumSection from './sections/BreadcrumSection';
import src1 from '../../assets/img-1.jpg';

const md5 = require('md5')

const todayDate = new Date().toISOString().slice(0, 10);
const token = md5(todayDate)

class FavorecidosPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalFavorecido: false,
      modalErro: false,
      modalErroMensagem: "",
      conta: "",
      favorecido: "",
      favorecido_conta: ""
    }

    this.deleteFavorecidoById = this.deleteFavorecidoById.bind(this)
    this.setInputValue = this.setInputValue.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.setStateModal = this.setStateModal.bind(this)
  }
  
  setStateModal(name, status) {
    this.setState({ [name] : status })
  }

  setInputValue (event) {
    let inputName  = event.target.name
    let inputValue = event.target.value
    let lastValueChar = (parseInt(inputValue.slice(-1)) >= 0 && parseInt(inputValue.slice(-1)) < 10) ? parseInt(inputValue.slice(-1)) : ""
    if ((inputName == "conta" || inputName == "favorecido_conta") && lastValueChar === "") {
      return 
    }
    this.setState({ [inputName]: inputValue })
  }

  submitForm(event) {
    event.preventDefault();
    let usuario_id = this.props.usuario.id
    if (this.state.conta.trim().length == 0 || this.state.favorecido.trim().length == 0 || this.state.favorecido_conta.trim().length == 0) {
      this.setState({ modalErroMensagem: "Dados prenchidos em branco, favor tentar novamente." }, () => {
        this.setStateModal("modalErro", true)
      })
      return false
    }
    axios.get(`/api/usuario/nome/${this.state.favorecido}/${token}`)
      .then(res => {
        if(res.data == "") {
          this.setState({ modalErroMensagem: "O nome do usuario a ser cadastrado como favorecido nao foi encontrado, favor tentar novamente." }, () => {
            this.setStateModal("modalErro", true)
          })
          return
        } else {
          let favorecido_id = res.data.id
          axios.get(`/api/conta/${this.state.conta}/${token}`)
            .then(res => {
              if(res.data == "") {
                this.setState({ modalErroMensagem: "Conta do usuario nao encontrada, favor tentar novamente." }, () => {
                  this.setStateModal("modalErro", true)
                })
                return
              } else {
                axios.get(`/api/conta/${this.state.favorecido_conta}/${token}`)
                  .then(res => {
                    if(res.data == "") {
                      this.setState({ modalErroMensagem: "Conta do favorecido nao encontrada, favor tentar novamente." }, () => {
                        this.setStateModal("modalErro", true)
                      })
                      return
                    } else {
                      axios.post(`/api/favorecido/${token}`, {
                        usuario_id: usuario_id,
                        usuario_conta_id: this.state.conta,
                        favorecido_id: favorecido_id,
                        favorecido_conta_id: this.state.favorecido_conta,
                      })
                        .then(res => {
                          if (parseInt(res.data) > 0) {
                            this.props.getFavorecidos(this.props.usuario)
                            this.setState({ modalFavorecido: false, modalErroMensagem: "", conta: "", favorecido: "", favorecido_conta: "" })
                          }
                        })
                        .catch(err => {
                          console.log(err)
                        })
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
  }

  deleteFavorecidoById(id) {
    axios.delete(`/api/favorecido/${token}`, {
        params: {
          id
        }
      })
      .then(res => {
        console.log(res)
        this.props.getFavorecidos(this.props.usuario)
      })
  }

  render() {
    let count = 1
    return (
      <React.Fragment>
        <BreadcrumSection page="Favorecidos" contas={this.props.contas} conta={this.props.conta} changeConta={this.props.changeConta} />
        <MDBRow className="justify-content-center">
          <MDBCol sm="12" md="12" lg="12" className="mb-5">
              <MDBCard className="mt-5">
                <MDBView className="gradient-card-header blue darken-2">
                  <h4 className="h4-responsive text-white">Favorecidos</h4>
                </MDBView>
                <MDBCardBody>
                  <MDBBtn color="primary" onClick={() => this.setStateModal("modalFavorecido", true)} >Cadastrar Novo</MDBBtn>
                  <MDBTable hover responsive>
                    <MDBTableHead color="blue-grey lighten-4">
                      <tr>
                        <th>#</th>
                        <th>Numero da Conta</th>
                        <th>Favorecido</th>
                        <th>Numero da Conta do Favorecido</th>
                        <th>Data Cadastro</th>
                        <th></th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {
                        this.props.favorecidos.map((arr, index) => {
                          return (
                            <tr key={arr.id}>
                              <td>{count++}</td>
                              <td>{arr.usuario_conta_id}</td>
                              <td>{arr.favorecido}</td>
                              <td>{arr.favorecido_conta_id}</td>
                              <td>{arr.data_cadastro}</td>
                              <td><a onClick={() => this.deleteFavorecidoById(arr.id)} ><MDBIcon icon="trash" /></a></td>
                            </tr>
                          )
                        })
                      }
                    </MDBTableBody>
                  </MDBTable>
                </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBModal /* toggle={this.toggle(9)} */ isOpen={this.state.modalFavorecido} size="lg">
          <MDBModalHeader>Cadastrar Favorecido</MDBModalHeader>
          <MDBModalBody className="text-center">
            <form  onSubmit={this.submitForm}>
              <p className="h5 text-center mb-4">Digite os dados abaixo</p>
              <div className="grey-text">
                <MDBInput
                  label="Digite o numero da sua conta"
                  group
                  type="text"
                  name="conta"
                  validate
                  //value={this.state.conta}
                  onChange={this.setInputValue}
                />
                <MDBInput
                  label="Digite o nome do favorecido"
                  group
                  type="text"
                  name="favorecido"
                  validate
                  //value={this.state.favorecido}
                  onChange={this.setInputValue}
                />
                <MDBInput
                  label="Digite o numero da conta do favorecido"
                  group
                  type="text"
                  name="favorecido_conta"
                  validate
                  //value={this.state.favorecido_conta}
                  onChange={this.setInputValue}
                />
              </div>
              <div className="text-center">
                <MDBBtn type="submit" >Cadastrar</MDBBtn>
              </div>
            </form>
          <MDBBtn color="secondary" onClick={() => this.setStateModal("modalFavorecido", false)}>Cancelar</MDBBtn>
          </MDBModalBody>
        </MDBModal>
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

export default FavorecidosPage