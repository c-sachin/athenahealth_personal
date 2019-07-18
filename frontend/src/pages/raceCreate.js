import React, { Component } from 'react';
import {
  MDBContainer,
  MDBNavLink,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import Cookies from 'js-cookie';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import helpers from '../components/helper';

class RaceCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      raceName: '',
      nameError: '',
      token: '',
      tokenId: '',
      alert: null,
      disable: false,
    };
  }

  validateName = () => {
    const { raceName } = this.state;

    this.setState({
      nameError:
        raceName.length > 3
          ? null
          : 'Race name must be longer than 3 characters',
    });
  };

  handleSubmit = async event => {
    this.validateName();
    event.preventDefault();

    const obj = {
      raceName: this.state.raceName,
    };
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    let _self = this;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}race/raceCreate`, obj, {
        params: {
          sessionToken: token,
          userId: tokenId,
        },
      })
      .then(res => {
        const title = 'Record inserted';
        const getAlert = () => (
          <SweetAlert success title={title} onConfirm={this.onConfirm} />
        );
        this.setState({
          alert: getAlert(),
        });
        this.setState({
          raceName: '',
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
    window.location.href = '/race';
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.validateName();
    });
  };

  render() {
    if (
      typeof Cookies.get('token_id') == 'undefined' ||
      typeof Cookies.get('token') == 'undefined' ||
      typeof Cookies.get('utype') == 'undefined' ||
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
                Create Race
                <MDBNavLink class="btn btn-info float-right btn-sm" to="/race">
                  <i class="fas fa-undo fa-fw" /> Back
                </MDBNavLink>
              </MDBCardHeader>
              <MDBCardBody>
                <h2 className="h2-responsive pb-4"> </h2>
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
                          Race name{' '}
                        </label>
                        <input
                          value={this.state.raceName}
                          name="raceName"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.nameError ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.nameError}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBBtn
                      className="btn-md"
                      color="primary"
                      type="submit"
                      disabled={this.state.disable}
                    >
                      <i class="fas fa-save fa-fw" /> Add
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

export default RaceCreate;
