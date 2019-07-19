import React, { Component } from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBFooter,
  MDBNavLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdbreact';

import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Cookies from 'js-cookie';
class Home extends Component {
  state = {
    collapseID: '',
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : '',
    }));

  closeCollapse = collapseID => () =>
    this.state.collapseID === collapseID && this.setState({ collapseID: '' });

  renderMainFooter() {
    return (
      <MDBFooter color="indigo">
        <p className="footer-copyright mb-0 py-3 text-center">
          &copy; {new Date().getFullYear()} Copyright{' '}
          <a href>  </a>
        </p>
      </MDBFooter>
    );
  }

  renderNonLoginNav(collapseID, overlay) {
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
          {this.renderMainFooter()}
        </div>
      </Router>
    );
  }

  renderMasterNavs(userType) {
    if (userType === '0') {
      // Master User as a Logged in user
      return (
        <MDBNavItem>
          <MDBNavLink
            onClick={this.closeCollapse('mainNavbarCollapse')}
            to="/FacilityPage"
          >
            <i className="fas fa-building fa-fw" /> Facility
          </MDBNavLink>
        </MDBNavItem>
      );
    } else {
      // EPIC User as a logged in user
      return '';
    }
  }

  renderMasterDataNavs(userType) {
    if (userType === '0') {
      // Master User as a Logged in user
      return (
        <MDBNavItem>
          <MDBDropdown>
            <MDBDropdownToggle nav caret>
              <i className="fas fa-database fa-fw" /> Master Management
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem href="/gender">
                <i className="fas fa-tasks fa-fw" /> Gender Master
              </MDBDropdownItem>
              <MDBDropdownItem href="/marital-status">
                <i className="fas fa-tasks fa-fw" /> Marital Status Master
              </MDBDropdownItem>
              <MDBDropdownItem href="/race">
                <i className="fas fa-tasks fa-fw" /> Race Master
              </MDBDropdownItem>
              <MDBDropdownItem href="/imaging">
                <i className="fas fa-tasks fa-fw" /> Imaging Master
              </MDBDropdownItem>
              <MDBDropdownItem href="/diagnosis">
                <i className="fas fa-tasks fa-fw" /> Diagnosis Master
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavItem>
      );
    } else {
      // EPIC User as a logged in user
      return '';
    }
  }

  renderChangePassword(userType) {
    if (userType === '0') {
      // Master User as a Logged in user
      return (
        <MDBDropdownItem href="/change-password">
          <i className="fas fa-key fa-fw" /> Change Password
        </MDBDropdownItem>
      );
    } else {
      // EPIC User as a logged in user
      return '';
    }
  }

  render() {
    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: 'transparent' }}
        onClick={this.toggleCollapse('mainNavbarCollapse')}
      />
    );

    const { collapseID } = this.state;

    if (
      typeof Cookies.get('token_id') !== 'undefined' ||
      typeof Cookies.get('token') !== 'undefined' ||
      typeof Cookies.get('utype') !== 'undefined'
    ) {
      var userType = Cookies.get('utype');
      var userName = 'User';
      if (userType === '0') {
        // Master User as a Logged in user
        userName = Cookies.get('user');
      } else {
        // EPIC User as a logged in user
        if (Cookies.get('epic_id') !== 'undefined') {
          userName = Cookies.get('epic_id');
        }
      }

      return (
        <Router>
          <div className="flyout">
            <MDBNavbar color="indigo" dark expand="md" fixed="top" scrolling>
              <MDBNavbarBrand href="/">Admin</MDBNavbarBrand>
              <MDBNavbarToggler
                onClick={this.toggleCollapse('mainNavbarCollapse')}
              />
              <MDBCollapse
                id="mainNavbarCollapse"
                isOpen={this.state.collapseID}
                navbar
              >
                <MDBNavbarNav right>
                  <MDBNavItem>
                    <MDBDropdown>
                      {/* <MDBDropdownToggle nav caret>
                        <i
                          data-toggle="tooltip"
                          data-placement="top"
                          title=""
                          className="fas fa-plus-circle"
                          data-original-title="Add"
                        />{' '}
                        Add
                      </MDBDropdownToggle> */}
                      {/* <MDBDropdownMenu>
                        <MDBDropdownItem href="/PatientScreening">
                          <i className="fas fa-search-plus fa-fw" /> Patient
                          Screenings
                        </MDBDropdownItem>
                        <MDBDropdownItem href="/dailyquery">
                          <i className="far fa-clock fa-fw" /> Daily Query
                        </MDBDropdownItem>
                        <MDBDropdownItem href="/add-chart-review">
                          <i className="fas fa-chart-bar" /> Chart Review
                        </MDBDropdownItem>
                        <MDBDropdownItem href="/before-after-analysis">
                          <i className="fas fa-chart-line fa-fw" /> Before /
                          After Analysis
                        </MDBDropdownItem>
                      </MDBDropdownMenu> */}
                    </MDBDropdown>
                  </MDBNavItem>
                  {this.renderMasterNavs(userType)}
                  <MDBNavItem>
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <span className="mr-2">
                          <i className="fas fa-user fa-fw" /> {userName}
                        </span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        {/* {this.renderChangePassword(userType)} */}
                        <MDBDropdownItem href="/logout">
                          <i className="fas fa-sign-out-alt fa-fw" /> Logout
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBNavbar>
            {collapseID && overlay}
            <main style={{ marginTop: '4rem' }}>
              <Routes />
            </main>
            <MDBFooter color="indigo">
              <p className="footer-copyright mb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright{' '}
                <span>  </span>
              </p>
            </MDBFooter>
          </div>
        </Router>
      );
    } else {
      return <div>{this.renderNonLoginNav(collapseID, overlay)}</div>;
    }
  }
}

export default Home;
