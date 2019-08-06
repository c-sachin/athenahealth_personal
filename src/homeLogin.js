import React, { Component } from 'react';
import logo from './advantia_logo.png';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBFooter,
} from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import queryString from 'query-string';

class HomeLogin extends Component {
  state = {
    collapseID: '',
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : '',
    }));

  closeCollapse = collapseID => () =>
    this.state.collapseID === collapseID && this.setState({ collapseID: '' });

  render() {
    const values = queryString.parse(window.location.search);
    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: 'transparent' }}
        onClick={this.toggleCollapse('mainNavbarCollapse')}
      />  
    );

    const { collapseID } = this.state;

    if (window.location.search !== '' && values.fid !== '') {
      return (
        <Router>
          <div className="flyout">
            <MDBNavbar color="indigo" dark expand="md" fixed="top" scrolling>
              <MDBNavbarBrand href="/">Agora</MDBNavbarBrand>
              <MDBNavbarToggler
                onClick={this.toggleCollapse('mainNavbarCollapse')}
              />
              <MDBCollapse
                id="mainNavbarCollapse"
                isOpen={this.state.collapseID}
                navbar
              />
            </MDBNavbar>
            {collapseID && overlay}
            <main style={{ marginTop: '4rem' }}>
              <Routes />
            </main>
            <MDBFooter color="indigo">
              <p className="footer-copyright mb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright{' '}
                <a href>  </a>
              </p>
            </MDBFooter>
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div className="flyout">
            <MDBNavbar color="indigo" dark expand="md" fixed="top" scrolling>
              <MDBNavbarBrand href="/"><img width="20%" src={logo} alt="logo" /></MDBNavbarBrand>
              {/* <MDBNavbarBrand href="/">Admin</MDBNavbarBrand> */}
              <MDBNavbarToggler
                onClick={this.toggleCollapse('mainNavbarCollapse')}
              />
              <MDBCollapse
                id="mainNavbarCollapse"
                isOpen={this.state.collapseID}
                navbar
              />
            </MDBNavbar>
            {collapseID && overlay}
            <main style={{ marginTop: '4rem' }}>
              <Routes />
            </main>
            <MDBFooter color="indigo">
              <p className="footer-copyright mb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright{' '}
                <a href> </a>
              </p>
            </MDBFooter>
          </div>
        </Router>
      );
    }
  }
}

export default HomeLogin;
