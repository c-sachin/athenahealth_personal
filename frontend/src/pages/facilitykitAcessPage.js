import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import axios from 'axios';
import Cookies from 'js-cookie';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

let facilityId = '';
class FacilitykitAcessPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.id;
    this.state = {
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

  checkFacililtyiKit() {
    let _self = this;
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}facilityKit/checkFacilityKi/` +
          facilityId
      )
      .then(res => {
        const data = res.data;
        _self.setState({ data });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  handleSubmit = async event => {
    this.validateName();
    event.preventDefault();
    this.state.token = Cookies.get('token');
    this.state.tokenId = Cookies.get('token_id');
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL
      }facilityKit/FacilityKitAccessCreate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.tokenId,
          session_token: this.state.token,
          facilityKitServer: this.state.facilityKitServer,
          facilityId: facilityId,
          facilityKitPort: this.state.facilityKitPort,
          facilityKitUserid: this.state.facilityKitUserid,
          facilityFhirSecret: this.state.facilityFhirSecret,
          facilityKitPassword: this.state.facilityKitPassword,
          facilityFhirId: this.state.facilityFhirId,
          facilityFhirHash: this.state.facilityFhirHash,
        }),
      }
    );
    if (response.status === 200) {
      const getAlert = () => (
        <SweetAlert
          success
          title="Record inserted"
          onConfirm={this.onConfirm}
        />
      );
      this.setState({
        alert: getAlert(),
      });

      this.setState({
        facilityKitServer: '',
        facilityKitUserid: '',
        facilityFhirSecret: '',
        facilityKitPassword: '',
        facilityFhirId: '',
        facilityFhirHash: '',
      });
    } else {
      alert('Wrong Parameter Provided.');
    }
  };

  onConfirm() {
    window.location.href = '/facilityPage';
  }

  componentDidMount() {
    let _self = this;
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}patients/Facilities`)
      .then(res => {
        const data = res.data;
        _self.setState({ data });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
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
                Create Facility Kit Access
                <Link
                  class="btn btn-info float-right btn-sm"
                  to={'/facilityPage'}
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>
              </MDBCardHeader>
              <MDBCardBody>
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
                          {' '}
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
                          {' '}
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
                          {' '}
                          secret id{' '}
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
                          {' '}
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
                          {' '}
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

export default FacilitykitAcessPage;
