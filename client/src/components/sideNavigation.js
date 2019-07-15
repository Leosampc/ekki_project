import React from 'react';
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo-bank.png'

const TopNavigation = (props) => {
    return (
        <div className="sidebar-fixed position-fixed">
            <a href="#!" className="logo-wrapper waves-effect">
                <img src={Logo} />
            </a>
            <MDBListGroup className="list-group-flush">
                <NavLink exact={true} to="/" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="chart-pie" className="mr-3"/>
                        Página Incial
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/favorecidos" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="users" className="mr-3"/>
                        Favorecidos
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/extrato" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="list-ul" className="mr-3"/>
                        &nbsp;Extratos
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/transferencia" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="money-check-alt" className="mr-3"/>
                        Transferências
                    </MDBListGroupItem>
                </NavLink>
                {/*<NavLink to="/404" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="exclamation" className="mr-3"/>
                        404
                    </MDBListGroupItem>
                </NavLink>*/}
            </MDBListGroup>
        </div>
    );
}

export default TopNavigation;