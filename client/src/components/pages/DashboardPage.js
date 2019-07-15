import React from 'react';
import { MDBRow } from 'mdbreact';
import AdminCardSection1 from './sections/AdminCardSection1';
import TableSection from './sections/TableSection';
import BreadcrumSection from './sections/BreadcrumSection';

const DashboardPage = (props) => { //todas as props sao recebidas atraves do componente anterior
  return (
    <React.Fragment>
      <BreadcrumSection page="Pagina Inicial" contas={props.contas} conta={props.conta} changeConta={props.changeConta} />
      <AdminCardSection1 usuario={props.usuario} conta={props.contas[props.conta]} extrato={props.extrato} />
      <TableSection extrato={props.extrato} />
    </React.Fragment>
  )
}

export default DashboardPage;