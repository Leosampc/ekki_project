import React from 'react';
import { MDBRow } from 'mdbreact';
import AdminCardSection1 from './sections/AdminCardSection1';
import AdminCardSection2 from './sections/AdminCardSection2';
import TableSection from './sections/TableSection';
import BreadcrumSection from './sections/BreadcrumSection';
import ChartSection1 from './sections/ChartSection1';
import ChartSection2 from './sections/ChartSection2';
import MapSection from './sections/MapSection';
import ModalSection from './sections/ModalSection';

const DashboardPage = (props) => {
  return (
    <React.Fragment>
      <BreadcrumSection contas={props.contas} conta={props.conta} changeConta={props.changeConta} />
      <AdminCardSection1 usuario={props.usuario} conta={props.contas[props.conta]} extrato={props.extrato} />
      {/*<ChartSection1 />*/}
      <TableSection extrato={props.extrato} />
      {/*<ChartSection2 />*/}
      <MDBRow className="mb-4">
          {/*<MapSection />*/}
          <ModalSection />
      </MDBRow>
      {/*<AdminCardSection2 />*/}
    </React.Fragment>
  )
}

export default DashboardPage;