import React from 'react';
import { MDBFooter, MDBBtn, MDBIcon } from 'mdbreact';

const Footer = () => {
    return (
        <MDBFooter color="blue" className="text-center font-small darken-2">
            <div className="pt-4">
            </div>
            <div className="pb-4">
                <MDBIcon fab icon="facebook" className="mr-3"/>
                <MDBIcon fab icon="twitter" className="mr-3" />
                <MDBIcon fab icon="github" className="mr-3"/>
            </div>
            <p className="footer-copyright mb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright: <a href="https://github.com/Leosampc/ekki_project"> Leonardo Sampaio da Cruz </a>
            </p>
        </MDBFooter>
    );
}

export default Footer;