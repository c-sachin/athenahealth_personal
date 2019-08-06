import React from 'react';
import {
  MDBEdgeHeader,
  MDBFreeBird,
  MDBCol,
  MDBRow,
  MDBCardBody,
} from 'mdbreact';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';
import Cookies from 'js-cookie';
import './homePage.css';
import helpers from '../components/helper';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      currentPassword: '',
      password: '',
      passwordConfirm: '',
      tokenId: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.msg = helpers.setMsg('Updating password...', '');
    this.msgBlank = helpers.setMsg('', '');

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    var _self = this;
    _self.setState({
      msg: _self.msg,
    });
    if (_self.validator.allValid()) {
      let tokenId = localStorage.getItem('token_id');
      const payload = {
        currentPassword: _self.state.currentPassword,
        password: _self.state.password,
        passwordConfirm: _self.state.passwordConfirm,
        userId: tokenId,
      };
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}Login/change-password`,
          payload
        )
        .then(response => {
          _self.props.history.push(`/logout`);
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
    if (
      typeof Cookies.get('token_id') === 'undefined' ||
      typeof Cookies.get('token') === 'undefined' ||
      typeof Cookies.get('utype') === 'undefined'
    ) {
      this.props.history.push(`/`);
      window.location.reload();
    }
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
                  <strong>Change Password</strong>
                </h4>
                <form noValidate onSubmit={this.onSubmit}>
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
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      placeholder="Enter Current Password"
                      value={this.state.currentPassword}
                      onChange={this.onChange}
                    />
                    <div className="text-danger">
                      {this.validator.message(
                        'currentPassword',
                        this.state.currentPassword,
                        'required'
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter New Password"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                    <div className="text-danger">
                      {this.validator.message(
                        'newPassword',
                        this.state.password,
                        'required|min:8'
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="passwordConfirm"
                      placeholder="Retype New Password"
                      value={this.state.passwordConfirm}
                      onChange={this.onChange}
                    />
                    <div className="text-danger">
                      {this.validator.message(
                        'retypePassword',
                        this.state.passwordConfirm,
                        'required|min:8'
                      )}
                    </div>
                  </div>
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-md btn-primary">
                      <i class="fas fa-key fa-fw" /> Update Password
                    </button>
                  </div>
                  <span class="help-block text-bold">
                    <i class="fa fa-asterisk fa-fw text-danger" /> You will be
                    logged out after updating your password.
                  </span>
                </form>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBFreeBird>
      </div>
    );
  }
}

export default Welcome;
