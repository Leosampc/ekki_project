import React from 'react';
import { MDBCard, MDBCardBody, MDBView, MDBTable, MDBTableBody, MDBTableHead, MDBRow, MDBCol } from 'mdbreact';

const TableSection = (props) => {
  let count = 1
  return (
    <MDBRow className="mb-4">
          <MDBCol md="12">
                <MDBCard className="mt-5">
                  <MDBView className="gradient-card-header blue darken-2">
                    <h4 className="h4-responsive text-white">Últimas transações</h4>
                  </MDBView>
                  <MDBCardBody>
                    <MDBTable hover responsive>
                      <MDBTableHead color="blue-grey lighten-4">
                        <tr>
                          <th>#</th>
                          <th>Conta</th>
                          <th>Favorecido</th>
                          <th>Conta Favorecido</th>
                          <th>Valor</th>
                          <th>Data de Realização</th>
                          <th>Status</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {
                          props.extrato.map((arr, index) => {
                            return (
                              <tr>
                                <td>{count++}</td>
                                <td>{arr.usuario_conta_id}</td>
                                <td>{arr.favorecido}</td>
                                <td>{arr.favorecido_conta_id}</td>
                                <td>R${parseFloat(arr.valor).toFixed(2)}</td>
                                <td>{arr.data_cadastro}</td>
                                <td>{arr.status}</td>
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
  )
}

export default TableSection;

