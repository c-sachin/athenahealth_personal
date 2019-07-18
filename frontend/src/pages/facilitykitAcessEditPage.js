import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import { MDBNavLink } from 'mdbreact';
import axios from 'axios';
import Cookies from 'js-cookie';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

let facilityId = '';
class FacilitykitAcessEditPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.id;
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      facilityKitServer: '',
      facilityKitPort: '',
      facilityId: '',
      facilityKitUserid: '',
      facilityFhirSecret: '',
      facilityKitPassword: '',
      facilityFhirId: '',
      facilityFhirHash: '',
      response: '',
      facilityKitServerErr: '',
      facilityIdErr: '',
      facilityKitUseridErr: '',
      facilityFhirSecretErr: '',
      facilityKitPasswordErr: '',
      facilityFhirIdErr: '',
      facilityFhirHashErr: '',
      facilityKitPortErr: '',
      data: [],
      alert: null,
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
      .get(`${process.env.REACT_APP_API_BASE_URL}patients/Facilities`)
      .then(res => {
        const data = res.data;
        this.setState({ data, msg: this.msgBlank });
      });

    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }facilityKit/FacilityKitAccessEdit/` + this.props.match.params.id,
        null,
        {
          params: {
            session_token: token,
            user_id: tokenId,
          },
        }
      )
      .then(response => {
        let data = response.data.result[0];
        this.setState({
          facilityKitServer: data.facility_kit_server,
          facilityKitPort: data.facility_kit_port,
          facilityId: data.f_facility_id,
          facilityKitUserid: data.facility_kit_userid,
          facilityFhirSecret: data.facility_fhir_secret,
          facilityKitPassword: data.facility_kit_password,
          facilityFhirId: data.facility_fhir_id,
          facilityFhirHash: data.facility_fhir_hash,
          msg: this.msgBlank,
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
    const { facilityKitServer } = this.state;
    const { facilityId } = this.state;
    const { facilityKitUserid } = this.state;
    const { facilityFhirSecret } = this.state;
    const { facilityKitPassword } = this.state;
    const { facilityFhirId } = this.state;
    const { facilityFhirHash } = this.state;
    const { facilityKitPort } = this.state;
    this.setState({
      facilityKitServerErr:
        facilityKitServer.length > 3
          ? null
          : 'Facility kit Server Name should have length more than 3',
      facilityIdErr: facilityId.length > 3 ? null : 'Please Select Facility Id',
      facilityKitPortErr:
        facilityKitPort.length > 3 ? null : 'Please Enter Port number',
      facilityKitUseridErr:
        facilityKitUserid.length > 3
          ? null
          : 'Please Enter Facility kit User id ',
      facilityFhirSecretErr:
        facilityFhirSecret.length > 3
          ? null
          : 'Please Enter Facility FHIR secret id ',
      facilityKitPasswordErr:
        facilityKitPassword.length > 3
          ? null
          : 'Please Enter Facility kit password',
      facilityFhirIdErr:
        facilityFhirId.length > 3 ? null : 'Please Enter Facility FHIR id  ',
      facilityFhirHashErr:
        facilityFhirHash.length > 3 ? null : 'Please Enter Facility FHIR hash ',
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
      facilityKitServer: this.state.facilityKitServer,
      facilityId: facilityId,
      facilityKitPort: this.state.facilityKitPort,
      facilityKitUserid: this.state.facilityKitUserid,
      facilityFhirSecret: this.state.facilityFhirSecret,
      facilityKitPassword: this.state.facilityKitPassword,
      facilityFhirId: this.state.facilityFhirId,
      facilityFhirHash: this.state.facilityFhirHash,
    };

    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }facilityKit/FacilityKitAccessUpdate/` + this.props.match.params.id,
        obj,
        {
          params: {
            session_token: token,
            user_id: tokenId,
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
          msg: this.msgBlank,
          alert: getAlert(),
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
    window.location.href = '/facilityPage';
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
                Edit Facility Kit Access
                <MDBNavLink
                  class="btn btn-info float-right btn-sm"
                  to="/facilityPage"
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
                <h2 className="h2-responsive pb-4"> </h2>
                <div>
                  <form
                    className="needs-validation"
                    onSubmit={this.handleSubmit}
                    noValidate
                  >
                    <MDBRow>
                      <MDBCol md="12" className="mb-12">
                        <h5>Facility Kit</h5> <hr />{' '}
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Server name{' '}
                        </label>
                        <input
                          value={this.state.facilityKitServer}
                          name="facilityKitServer"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityKitServerErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityKitServerErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Port number{' '}
                        </label>
                        <input
                          value={this.state.facilityKitPort}
                          name="facilityKitPort"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityKitPortErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityKitPortErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          User Name{' '}
                        </label>
                        <input
                          value={this.state.facilityKitUserid}
                          name="facilityKitUserid"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityKitUseridErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityKitUseridErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Password
                        </label>
                        <input
                          value={this.state.facilityKitPassword}
                          name="facilityKitPassword"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityKitPasswordErr
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityKitPasswordErr}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <br />
                    <MDBRow>
                      <MDBCol md="12" className="mb-12">
                        <h5>Facility Fhir</h5> <hr />{' '}
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Secret id{' '}
                        </label>
                        <textarea
                          value={this.state.facilityFhirSecret}
                          name="facilityFhirSecret"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityFhirSecretErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityFhirSecretErr}
                        </div>
                      </MDBCol>

                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Client Id{' '}
                        </label>
                        <textarea
                          value={this.state.facilityFhirId}
                          name="facilityFhirId"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityFhirIdErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityFhirIdErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Hash{' '}
                        </label>
                        <textarea
                          value={this.state.facilityFhirHash}
                          name="facilityFhirHash"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityFhirHashErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityFhirHashErr}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBBtn className="btn-md" color="primary" type="submit">
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

export default FacilitykitAcessEditPage;
