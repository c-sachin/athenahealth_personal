/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
} from 'mdbreact';
import Cookies from 'js-cookie';
import helpers from '../components/helper';
import SimpleReactValidator from 'simple-react-validator';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      email: '',
      password: '',
      tokenId: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Processing...', '');
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
    });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    var _self = this;
    e.preventDefault();
    _self.setState({
      tokenId: Cookies.get('token_id'),
      msg: _self.msg,
    });
    if (_self.validator.allValid()) {
      const user = {
        email: _self.state.email,
        password: _self.state.password,
        userid: '',
      };
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}Login/LoginUser`, user)
        .then(response => {
          Cookies.set('token', response.data.result[0].session_id);
          Cookies.set('token_id', response.data.result[0].user_id);
          Cookies.set('utype', response.data.result[0].utype);
          Cookies.set('user', response.data.result[0].user);
          _self.setState({ msg: _self.msgBlank });
          _self.props.history.push(`/FacilityPage`);
          window.location.reload();
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
    } else {
      _self.setState({
        msg: _self.msgBlank,
      });
      _self.validator.showMessages();
      //   _self.forceUpdate();
    }
  }

  render() {
    return (
      <MDBContainer className="mt-5">
        <MDBRow className="my-5">
          <MDBCol md="6">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Login
              </MDBCardHeader>
              <MDBCardBody>
                <form noValidate onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">
                      <i class="fas fa-user fa-fw" /> Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter Email"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                    <div className="text-danger">
                      {this.validator.message(
                        'email',
                        this.state.email,
                        'required|email'
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">
                      <i class="fas fa-key fa-fw" /> Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter Password"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                    <div className="text-danger">
                      {this.validator.message(
                        'password',
                        this.state.password,
                        'required'
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary btn-block"
                  >
                    <i class="fas fa-sign-in-alt fa-fw" /> Sign in
                  </button>
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
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Login;
