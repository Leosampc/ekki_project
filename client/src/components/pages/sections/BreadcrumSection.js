import React from 'react';
import { MDBCard, MDBCardBody, MDBIcon, MDBBreadcrumb, MDBBreadcrumbItem, MDBFormInline, MDBBtn } from 'mdbreact';

const BreadcrumSection = (props) => {
  return (
    <MDBCard className="mb-5">
        <MDBCardBody id="breadcrumb" className="d-flex align-items-center justify-content-between">
            <MDBBreadcrumb>
                <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Página Inicial</MDBBreadcrumbItem>
            </MDBBreadcrumb>
            <MDBFormInline className="md-form m-0">
                <h5 style={{ marginRight: 10, }}>Conta: </h5>
                <select className="browser-default custom-select" value={props.conta} onChange={props.changeConta} >
                  {
                    props.contas.map((arr, index) => {
                      return <option key={arr.id} value={index}>{arr.id}</option>
                    })
                  }
                </select>
                {/*<input className="form-control form-control-sm" type="search" placeholder="Type your query" aria-label="Search"/>
                <MDBBtn size="sm" color="primary" className="my-0" type="submit"><MDBIcon icon="search" /></MDBBtn>*/}
            </MDBFormInline>
        </MDBCardBody>
    </MDBCard>
  )
}

export default BreadcrumSection;

