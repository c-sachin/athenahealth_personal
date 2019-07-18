/* eslint-disable eqeqeq */
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

class FacilityCreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      facilityName: '',
      facilityId: '',
      ownerName: '',
      activeStatus: 1,
      response: '',
      responseToPost: '',
      nameError: '',
      facilityIdError: '',
      facilityOwnerError: '',
      token: '',
      tokenId: '',
      alert: null,
      message: '',
      disable: false,
    };
  }

  validateName = () => {
    const { facilityName } = this.state;
    const { facilityId } = this.state;
    const { ownerName } = this.state;
    this.setState({
      nameError:
        facilityName.length > 3
          ? null
          : 'Facility Name must be longer than 3 characters',
      facilityIdError:
        facilityId.length > 3
          ? null
          : 'Facility Id must be longer than 3 characters',
      facilityOwnerError:
        ownerName.length > 3
          ? null
          : 'Facility Owner Name mustbe longer than 3 characters',
    });
  };

  handleSubmit = async event => {
    this.validateName();
    event.preventDefault();

    const obj = {
      facilityName: this.state.facilityName,
      facilityId: this.state.facilityId,
      ownerName: this.state.ownerName,
      activeStatus: this.state.activeStatus,
    };
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    let _self = this;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilities/Facilitycreate`,
        obj,
        {
          params: {
            sessionToken: token,
            userId: tokenId,
          },
        }
      )
      .then(res => {
        const title = 'Record inserted';
        const getAlert = () => (
          <SweetAlert success title={title} onConfirm={this.onConfirm} />
        );
        this.setState({
          alert: getAlert(),
        });
        this.setState({
          facilityName: '',
          facilityId: '',
          ownerName: '',
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
    window.location.href = '/FacilityPage';
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.validateName();
    });
  };

  doesFacilitAppIdExist = event => {
    if (event.target.value != '') {
      let facilityId = event.target.value;
      let postData = {
        edit: false,
        facilityId: this.props.match.params.id,
      };
      let _self = this;
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }facilities/doesFacilitAppIdExist/` + facilityId,
          { postData }
        )
        .then(res => {
          let msgErr = helpers.setMsg('', '');
          this.setState({
            msg: msgErr,
            disable: false,
          });
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
            disable: true,
          });
        });
    }
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
                Create Facility
                <MDBNavLink
                  class="btn btn-info float-right btn-sm"
                  to="/facilityPage"
                >
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
                          Facility name{' '}
                        </label>
                        <input
                          value={this.state.facilityName}
                          name="facilityName"
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
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterEmailEx2"
                          className="grey-text"
                        >
                          Facility App id
                        </label>

                        <input
                          value={this.state.facilityId}
                          name="facilityId"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterEmailEx2"
                          className={`form-control ${
                            this.state.facilityIdError ? 'is-invalid' : ''
                          }`}
                          onBlur={this.doesFacilitAppIdExist}
                          required={true}
                        />
                        <div className="invalid-feedback">
                          {this.state.message}
                          {this.state.facilityIdError}
                        </div>
                        <span class="text-danger">{this.state.message}</span>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Facility Owner name{' '}
                        </label>
                        <input
                          value={this.state.ownerName}
                          name="ownerName"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityOwnerError ? 'is-invalid' : ''
                          }`}
                          required={true}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityOwnerError}
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

export default FacilityCreatePage;
