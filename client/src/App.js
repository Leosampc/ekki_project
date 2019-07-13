import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import TopNavigation from './components/topNavigation';
import SideNavigation from './components/sideNavigation';
import Footer from './components/Footer';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { usuario: [] }
    this.setUsuario = this.setUsuario.bind(this)
  }

  setUsuario(usuario) {
    this.setState({ usuario })
  }

  render() {
    return (
        <div className="flexible-content">
          <TopNavigation />
          <SideNavigation usuario={this.state.usuario} />
          <main id="content" className="p-5">
            <Routes setUsuario={this.setUsuario} />
          </main>
          <Footer />
        </div>
    );
  }
}

export default App;
