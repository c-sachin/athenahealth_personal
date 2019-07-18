import React, { Component } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBCardBody,
  MDBEdgeHeader,
  MDBFreeBird,
} from 'mdbreact';
import axios from 'axios';
import Cookies from 'js-cookie';
import helpers from '../components/helper';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      data: [],
    };
    this.msg = helpers.setMsg('Logging out...', '');
    this.msgBlank = helpers.setMsg('', '');
  }
  componentDidMount() {
    var _self = this;
    var tokenId = Cookies.get('token_id');
    var token = Cookies.get('token');
    _self.setState({
      msg: _self.msg,
    });
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}login/logout`, null, {
        params: {
          user_id: tokenId,
          session_token: token,
        },
      })
      .then(res => {
        var returnPath = '/';
        if (Cookies.get('utype') === '0') {
          returnPath = '/master/login';
        }
        Cookies.remove('token');
        Cookies.remove('token_id');
        Cookies.remove('facility_app_id');
        Cookies.remove('epic_id');
        Cookies.remove('utype');
        Cookies.remove('user');
        localStorage.clear();
        _self.props.history.push(returnPath);
        window.location.reload();
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  render() {
    return (
      <div>
        <MDBEdgeHeader color="indigo darken-3" />
        <MDBFreeBird>
          <MDBRow>
            <MDBCol
              md="6"
              className="mx-auto float-none white z-depth-1 py-2 px-2"
            >
              <MDBCardBody>
                <h4 className="h4-responsive mb-4 text-center">
                  <strong>Logging out...</strong>
                </h4>
                <MDBCol md="12">
                  {this.state.msg[0].msgLoading !== '' ? (
                    <p className="text-center">
                      {' '}
                      {this.state.msg[0].msgLoading}{' '}
                      <i className="fa fa-spinner fa-pulse fa-fw" />
                    </p>
                  ) : (
                    ''
                  )}
                  {this.state.msg[0].msgError !== '' ? (
                    <p className="text-center text-danger">
                      <i className="fa fa-exclamation-triangle fa-fw" />{' '}
                      {this.state.msg[0].msgError}{' '}
                    </p>
                  ) : (
                    ''
                  )}
                </MDBCol>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBFreeBird>
      </div>
    );
  }
}

export default Logout;
