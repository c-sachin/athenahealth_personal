/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBContainer,
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

let facilityId = '';
let facilityUserId = '';
class FacilityUserEditPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.facility_id;
    facilityUserId = this.props.match.params.facility_user_id;

    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      facilityUserName: '',
      facilityId: '',
      facilityEpicuserId: '',
      response: '',
      facilityUserNameErr: '',
      facilityIdErr: '',
      facilityEpicuserIdErr: '',
      data: [],
      message: '',
      disable: false,
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgUpdate = helpers.setMsg('Updating data...', '');
  }
  componentDidMount() {
    this.setState({
      msg: this.msg,
    });
    let _self = this;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityUsers/FacilityUserEdit/` +
          facilityUserId
      )
      .then(response => {
        let data = response.data.result[0];
        this.setState({
          msg: this.msgBlank,
          facilityUserName: data.m_facility_user_name,
          facilityId: data.f_facility_id,
          facilityEpicuserId: data.m_facility_epicuser_id,
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
    const { facilityUserName } = this.state;
    const { facilityId } = this.state;
    const { facilityEpicuserId } = this.state;

    this.setState({
      facilityUserNameErr:
        facilityUserName.length > 3
          ? null
          : 'Facility user Name must be longer than 3 characters',
      facilityIdErr: facilityId.length > 3 ? null : 'Please Select Facility Id',
      facilityEpicuserIdErr:
        facilityEpicuserId.length > 3
          ? null
          : 'Please Enter Facility Epic User Id ',
    });
  };
  handleSubmit = async event => {
    this.validateName();
    event.preventDefault();
    this.setState({
      msg: this.msgUpdate,
    });
    const obj = {
      facilityUserName: this.state.facilityUserName,
      facilityId: this.state.facilityId,
      facilityEpicuserId: this.state.facilityEpicuserId,
    };
    let _self = this;
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }facilityUsers/FacilityUserUpdate/` + facilityUserId,
        obj
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
    window.location.href = '/facilityUser/' + facilityId;
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.validateName();
    });
  };

  doesFacilityEpicUserIdExist = event => {
    if (event.target.value != '') {
      let epicUserId = event.target.value;
      let postData = {
        edit: true,
        epicUserId: epicUserId,
        userId: this.props.match.params.facility_user_id,
        facility_id: this.props.match.params.facility_id,
      };
      let _self = this;
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }facilityUsers/doesFacilityEpicUserIdExist`,
          { postData }
        )
        .then(res => {
          if (res.data.error === true) {
          } else {
            let msgErr = helpers.setMsg('', '');
            _self.setState({ msg: msgErr, disable: false });
          }
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
    // Check if cookies available
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
                Edit Facility User
                <Link
                  class="btn btn-info float-right btn-sm"
                  to={'/facilityUser/' + facilityId}
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>
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
                      <MDBCol md="6" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Facility User name{' '}
                        </label>
                        <input
                          value={this.state.facilityUserName}
                          name="facilityUserName"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityUserNameErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityUserNameErr}
                        </div>
                      </MDBCol>
                      <MDBCol md="6" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Facility Epic User Id{' '}
                        </label>
                        <input
                          value={this.state.facilityEpicuserId}
                          name="facilityEpicuserId"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.facilityEpicuserIdErr ? 'is-invalid' : ''
                          }`}
                          required={true}
                          onBlur={this.doesFacilityEpicUserIdExist}
                        />
                        <div className="invalid-feedback">
                          {this.state.facilityEpicuserIdErr}
                        </div>
                        <span class="text-danger">{this.state.message}</span>
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

export default FacilityUserEditPage;
