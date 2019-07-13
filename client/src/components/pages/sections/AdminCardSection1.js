import React from 'react';
import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol, MDBCardText, MDBJumbotron, MDBContainer, MDBBadge } from 'mdbreact';

function formataTelefone(v) {
  v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  v = v.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
  return v;
}

const AdminCardSection1 = (props) => {
  if (typeof props.conta === 'undefined') {
    return <div>teste</div>
  }
  let saldo = parseFloat(props.conta.saldo)
  let limite = parseFloat(props.conta.limite)
  let disponivel = (saldo >= 0) ? 100 : parseInt((saldo * -1) / limite * 100)

  return (
    <MDBRow className="mb-4">
        <MDBCol xl="8" md="6" className="mb-3">
          <MDBCard color="primary-color" className="classic-admin-card">
            <MDBCardBody>
            <p className="white-text">{props.usuario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")}</p>
              <h4><strong>{props.usuario.nome}</strong></h4>
            </MDBCardBody>
            <MDBCardBody>
            <p>{formataTelefone(props.usuario.telefone)}</p>
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
                  <strong>R${props.conta.saldo.toFixed(2)}</strong>
                </h4>
              </div>
            </div>
            <MDBCardBody>
              <div className="progress">
                <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg-primary" role="progressbar"
                  style={{ width: `${disponivel}%` }}></div>
              </div>
              <MDBCardText>Limite da conta: R${props.conta.limite.toFixed(2)} ({disponivel}%)</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
  )
}

export default AdminCardSection1;

