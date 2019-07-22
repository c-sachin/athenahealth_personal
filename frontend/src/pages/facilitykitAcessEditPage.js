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
      facilityPracticeid: '',
      facilityDepartmentid: '',
      facilityId: '',
      facilitySurveyToken: '',
      facilitySurveyCampaignid: '',
      facilitySecretid: '',
      facilityFhirId: '',
      response: '',
      facilityPracticeidErr: '',
      facilityIdErr: '',
      facilitySurveyTokenErr: '',
      facilitySurveyCampaignidErr: '',
      facilitySecretidErr: '',
      facilityFhirIdErr: '',
      facilityDepartmentidErr: '',
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
          facilityPracticeid: data.facility_practice_id,
          facilityDepartmentid: data.facility_department_id,
          facilityId: data.f_facility_id,
          facilitySurveyToken: data.facility_survey_token,
          facilitySurveyCampaignid: data.facility_survey_campaign_id,
          facilitySecretid: data.facility_fhir_secret,
          facilityFhirId: data.facility_fhir_id,
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
    const { facilityPracticeid } = this.state;
    const { facilityId } = this.state;
    const { facilityDepartmentid } = this.state;
    const { facilitySurveyToken } = this.state;
    const { facilitySurveyCampaignid } = this.state;
    const { facilitySecretid } = this.state;
    const { facilityFhirId } = this.state;
    this.setState({
      facilityPracticeidErr:

        facilityPracticeid.length > 3 ? null : 'Please Enter Practice Id',
      facilityIdErr: 
        facilityId.length > 3 ? null : 'Please Select Facility Id',
      facilityDepartmentidErr:
        facilityDepartmentid.length > 0 ? null : 'Please Enter Department Id',
      facilitySurveyTokenErr:
        facilitySurveyToken.length > 3 ? null : 'Please Enter Survey Token ',
      facilitySurveyCampaignidErr:
        facilitySurveyCampaignid.length > 3 ? null : 'Please Enter Survey Campaign id ',
      facilitySecretidErr:
        facilitySecretid.length > 3 ? null : 'Please Enter Secret Key',
      facilityFhirIdErr:
        facilityFhirId.length > 3 ? null : 'Please Enter Client id  ',
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
      facilityPracticeid: this.state.facilityPracticeid,
      facilityId: facilityId,
      facilityDepartmentid: this.state.facilityDepartmentid,
      facilitySurveyToken: this.state.facilitySurveyToken,
      facilitySurveyCampaignid: this.state.facilitySurveyCampaignid,
      facilitySecretid: this.state.facilitySecretid,
      facilityFhirId: this.state.facilityFhirId,
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
                Edit Facility Settings
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
                        <h5>EHR Setting </h5> <hr />{' '}
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Practice Id{' '}
                        </label>
                        <input
                          value={this.state.facilityPracticeid}
                          name="facilityPracticeid"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityPracticeidErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityPracticeidErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Department Id{' '}
                        </label>
                        <input
                          value={this.state.facilityDepartmentid}
                          name="facilityDepartmentid"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityDepartmentidErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityDepartmentidErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Survey token{' '}
                        </label>
                        <input
                          value={this.state.facilitySurveyToken}
                          name="facilitySurveyToken"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilitySurveyTokenErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilitySurveyTokenErr}
                        </div>
                      </MDBCol>

                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Survey Campaign Id{' '}
                        </label>
                        <input
                          value={this.state.facilitySurveyCampaignid}
                          name="facilitySurveyCampaignid"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilitySurveyCampaignidErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilitySurveyCampaignidErr}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <br />
                    <MDBRow>
                      <MDBCol md="12" className="mb-12">
                        <h5>EHR FHIR</h5> <hr />{' '}
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Client Id{' '}
                        </label>
                        <input
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
                          Secret Id
                        </label>
                        <input
                          value={this.state.facilitySecretid}
                          name="facilitySecretid"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilitySecretidErr
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilitySecretidErr}
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
