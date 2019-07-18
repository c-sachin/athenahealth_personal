import React, { Component } from 'react';
import {
  MDBContainer,
  MDBNavLink,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
} from 'mdbreact';
import axios from 'axios';
import Cookies from 'js-cookie';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

class GenderEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      genderName: '',
      response: '',
      nameError: '',
      alert: null,
      disable: false,
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgUpdate = helpers.setMsg('Updating data...', '');
  }

  componentDidMount() {
    let _self = this;
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    this.setState({
      msg: this.msg,
    });
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}gender/genderEdit/` +
          this.props.match.params.id,
        null,
        {
          params: {
            sessionToken: token,
            userId: tokenId,
          },
        }
      )
      .then(response => {
        let data = response.data.result;
        console.log(data);
        this.setState({
          msg: this.msgBlank,
          genderName: data[0].gender_name,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  validateName = () => {
    const { genderName } = this.state;

    this.setState({
      nameError:
        genderName.length > 3
          ? null
          : 'Gender Name must be longer than 3 characters',
    });
  };
  handleSubmit = async event => {
    this.validateName();
    event.preventDefault();
    let _self = this;
    this.setState({
      msg: this.msgUpdate,
    });
    const obj = {
      genderName: this.state.genderName,
    };
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}gender/genderUpdate/` +
          this.props.match.params.id,
        obj,
        {
          params: {
            sessionToken: token,
            userId: tokenId,
          },
        }
      )
      .then(res => {
        const getAlert = () => (
          <SweetAlert
            success
            title="Record updated"
            onConfirm={this.onConfirm}
          />
        );
        this.setState({
          alert: getAlert(),
          msg: this.msgBlank,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  };

  onConfirm() {
    window.location.href = '/gender';
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.validateName();
    });
  };

  render() {
    if (
      typeof Cookies.get('token_id') === 'undefined' ||
      typeof Cookies.get('token') === 'undefined' ||
      typeof Cookies.get('utype') === 'undefined' ||
      Cookies.get('utype') !== '0'
    ) {
      this.props.history.push(`/`);
      window.location.reload();
    }
    return (
      <MDBContainer className="mt-5">
        <MDBRow className="my-5">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Edit Gender
                <MDBNavLink
                  class="btn btn-info float-right btn-sm"
                  to="/gender"
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </MDBNavLink>
              </MDBCardHeader>
              <MDBCardBody>
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
                <div>
                  <form
                    className="needs-validation"
                    onSubmit={this.handleSubmit}
                    noValidate
                  >
                    <MDBRow>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Gender name{' '}
                        </label>
                        <input
                          value={this.state.genderName}
                          name="genderName"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.nameError ? 'is-invalid' : ''
                          }`}
                          placeholder="Gender Name"
                        />
                        <div className="invalid-feedback">
                          {this.state.nameError}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBBtn
                      color="primary"
                      type="submit"
                      disabled={this.state.disable}
                    >
                      <i class="fas fa-save fa-fw" /> Update
                    </MDBBtn>
                  </form>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {this.state.alert}
      </MDBContainer>
    );
  }
}

export default GenderEdit;
