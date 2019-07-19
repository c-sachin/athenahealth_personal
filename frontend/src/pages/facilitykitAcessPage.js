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
  }
  validateName = () => {
    const { facilityPracticeid } = this.state;
    const { facilityId } = this.state;
    const { facilitySurveyToken } = this.state;
    const { facilitySurveyCampaignid } = this.state;
    const { facilitySecretid } = this.state;
    const { facilityFhirId } = this.state;
    const { facilityDepartmentid } = this.state;

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
          facilityPracticeid: this.state.facilityPracticeid,
          facilityId: facilityId,
          facilityDepartmentid: this.state.facilityDepartmentid,
          facilitySurveyToken: this.state.facilitySurveyToken,
          facilitySurveyCampaignid: this.state.facilitySurveyCampaignid,
          facilitySecretid: this.state.facilitySecretid,
          facilityFhirId: this.state.facilityFhirId,
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
        facilityPracticeid: '',
        facilityDepartmentid: '',
        facilitySurveyToken: '',
        facilitySurveyCampaignid: '',
        facilitySecretid: '',
        facilityFhirId: '',
        
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
                Facility Settings
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
