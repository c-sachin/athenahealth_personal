/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import axios from 'axios';
import './reportcheckbox';
import moment from 'moment';
import $ from 'jquery';

import {
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from 'mdbreact';
import Cookies from 'js-cookie';
import SimpleReactValidator from 'simple-react-validator';
import helpers from '../components/helper';
import {
  charCheckbox,
  vitalCheckbox,
  imaging,
  systemEntries,
  documentType,
} from './reportcheckboxField';
const checkboxStyle = {
  zoom: 1.5,
};

class AddChartReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      patientInfo: [],
      divStyle: {},
      mrn: '',
      name: '',
      gender: '',
      dob: '',
      message: '',
      identifier: '',
      imagingFilterArr: [],
      charFilterArr: [],
      documentTypeFilterArr: [],
      vitalSignsArr: [],
      systemEntryArr: [],
      imagingMriResult: [],
      isChecked: false,
    };

    this.validator = new SimpleReactValidator({
      default: 'This field is required.',
    });
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
  }
  componentDidMount() {
    let _self = this;

    if (
      _self.props.match.params.id !== '' &&
      typeof _self.props.match.params.id !== 'undefined'
    ) {
      let mrnLength = _self.props.match.params.id.length;
      if (mrnLength >= 5) {
        let mrnVal = _self.props.match.params.id;
        axios
          .get(
            `${process.env.REACT_APP_API_BASE_URL}chartReview/patientSearch/` +
              mrnVal
          )
          .then(response => {
            _self.setState({
              msg: _self.msgBlank,
              mrn: response.data.result.patient_mrn,
              name: response.data.result.patient_name,
              dob: moment(response.data.result.patient_dob).format(
                'MM-DD-YYYY'
              ),
              gender: response.data.result.patient_gender,
              identifier: response.data.result.patient_identifier,
            });
          })
          .catch(err => {
            let msgErr = helpers.errMessage(err);
            _self.setState({
              msg: msgErr,
            });
          });
      }
    }
  }

  patientSearchhandler = e => {
    let _self = this;
    _self.setState({
      msg: _self.msg,
      mrn: e.target.value,
    });
    if (e.target.value.length >= 5) {
      let mrnVal = e.target.value;
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}chartReview/patientSearch/` +
            mrnVal
        )
        .then(response => {
          _self.setState({
            msg: _self.msgBlank,
            mrn: response.data.result.patient_mrn,
            name: response.data.result.patient_name,
            dob: moment(response.data.result.patient_dob).format('MM-DD-YYYY'),
            gender: response.data.result.patient_gender,
            identifier: response.data.result.patient_identifier,
          });
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
        mrn: e.target.value,
      });
    }
  };

  patientSearchByName = e => {
    let _self = this;
    _self.setState({
      msg: _self.msg,
      name: e.target.value,
    });
    if (e.target.value.length >= 3) {
      let patientName = e.target.value;
      axios
        .get(
          `${
            process.env.REACT_APP_API_BASE_URL
          }chartReview/patientSearchByName/` + patientName
        )
        .then(response => {
          _self.setState({
            msg: _self.msgBlank,
          });
          if (response.data.result.length <= 0) {
            _self.setState({
              patientInfo: [],
              divStyle: {},
              message: response.data.message,
            });
          } else {
            _self.setState({
              patientInfo: response.data.result,
              divStyle: { height: '350px', 'overflow-y': 'scroll' },
              message: '',
            });
          }
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
        name: e.target.value,
      });
    }
  };

  selectPatient(mrn, name, dob, gender, identifier, e) {
    this.setState({
      mrn: mrn,
      name: name,
      dob: dob,
      gender: gender,
      identifier: identifier,
    });
  }
  clearInput = () => {
    window.location.reload();
  };

  handleInput = e => {
    this.setState({ mrn: e.target.value });
  };

  charChangeHandler = e => {
    let _self = this;
    if (e.target.value === 'charAll') {
      _self.state.charFilterArr = [];
      this.state.charFilterArr.push(
        { name: 'Past Medical History' },
        { name: 'Medications taken' },
        { name: 'Dose' },
        { name: 'Allergies' },
        { name: 'Surgical History' },
        { name: 'Birth History' },
        { name: 'Social history' }
      );
      if (e.target.checked == false) {
        _self.state.charFilterArr = [];
      }
    } else {
      let charVal = e.target.value;
      _self.state.charFilterArr.map(function(val, key) {
        if (val.name.toLowerCase() === e.target.value.toLowerCase()) {
          if (e.target.checked == false) {
            _self.state.charFilterArr.splice(key, 1);
            charVal = '';
          }
        }
      });
      if (charVal !== '') {
        this.state.charFilterArr.push({
          name: charVal,
        });
      }
    }
  };
  imagingChangeHandler = e => {
    let _self = this;
    if (e.target.value === 'All') {
      _self.state.imagingFilterArr = [];
      this.state.imagingFilterArr.push(
        { name: 'Ultrasound' },
        { name: 'CT' },
        { name: 'MRI' },
        { name: 'EKG' },
        { name: 'Plain radiograph' },
        { name: 'Nuclear Medicine' }
      );
      if (e.target.checked == false) {
        _self.state.imagingFilterArr = [];
      }
    } else {
      let imagingVal = e.target.value;
      _self.state.imagingFilterArr.map(function(val, key) {
        if (val.name.toLowerCase() === e.target.value.toLowerCase()) {
          if (e.target.checked == false) {
            _self.state.imagingFilterArr.splice(key, 1);
            imagingVal = '';
          }
        }
      });
      if (imagingVal !== '') {
        this.state.imagingFilterArr.push({
          name: imagingVal,
        });
      }
    }
  };
  documentTypeChangeHandler = e => {
    let _self = this;
    if (e.target.value === 'All') {
      _self.state.documentTypeFilterArr = [];
      _self.state.documentTypeFilterArr.push(
        { name: 'Discharge Notes' },
        { name: 'History & Physical Notes' },
        { name: 'Progress Notes' },
        { name: 'Procedure Notes' },
        { name: 'Social Work' },
        { name: 'Admission Notes' },
        { name: 'Pre-operative Notes' },
        { name: 'Operative Notes' },
        { name: 'Anesthesia Notes' }
      );
      if (e.target.checked == false) {
        _self.state.documentTypeFilterArr = [];
      }
    } else {
      let documentVal = e.target.value;

      _self.state.documentTypeFilterArr.map(function(val, key) {
        if (val.name.toLowerCase() === e.target.value.toLowerCase()) {
          if (e.target.checked == false) {
            _self.state.documentTypeFilterArr.splice(key, 1);
            documentVal = '';
          }
        }
      });
      if (documentVal !== '') {
        _self.state.documentTypeFilterArr.push({
          name: documentVal,
          type: e.target.name,
        });
      }
    }
  };

  vitalSignsChangeHandler = e => {
    let _self = this;
    if (e.target.value === 'allValue') {
      _self.state.vitalSignsArr = [];
      this.state.vitalSignsArr.push(
        { name: 'HEART RATE ECG', value: 'heartRateSelectAll', id: '1' },
        { name: 'HEART RATE ECG', value: '2', id: '1' },
        { name: 'HEART RATE ECG', value: '3', id: '1' },
        { name: 'blood pressure', value: 'bloodPessureSelectAll', id: '2' },
        { name: 'blood pressure', value: '2', id: '2' },
        { name: 'blood pressure', value: '3', id: '2' },
        {
          name: 'R AN ARTERIAL BLOOD PRESSURE',
          value: 'meanArterialSelectAll',
          id: '3',
        },
        { name: 'R AN ARTERIAL BLOOD PRESSURE', value: '2', id: '3' },
        { name: 'R AN ARTERIAL BLOOD PRESSURE', value: '3', id: '3' },
        { name: 'RESP RATE', value: 'respiratoryRateSelectAll', id: '4' },
        { name: 'RESP RATE', value: '2', id: '4' },
        { name: 'RESP RATE', value: '3', id: '4' },
        { name: 'Oxygen Saturation', value: 'o2SaturationSelectAll', id: '5' },
        { name: 'Oxygen Saturation', value: '2', id: '5' },
        { name: 'Oxygen Saturation', value: '3', id: '5' }
      );
      if (e.target.checked == false) {
        _self.state.vitalSignsArr = [];
      }
    } else {
      let vitalVal = e.target.value;
      _self.state.vitalSignsArr.map(function(val, key) {
        if (val.id.toLowerCase() === e.target.dataset.id.toLowerCase()) {
          if (e.target.checked == false) {
            _self.state.vitalSignsArr.splice(key, 1);
            vitalVal = '';
          }
        }
      });
      if (vitalVal !== '') {
        this.state.vitalSignsArr.push({
          id: e.target.dataset.id,
          value: e.target.id,
          name: e.target.dataset.name,
        });
      }
    }
  };
  systemEntriesChangeHandler = e => {
    let _self = this;
    if (e.target.value === 'All') {
      _self.state.systemEntryArr = [];
      this.state.systemEntryArr.push(
        { value: 'Inpatient', id: '0' },
        {
          value: 'Doctor assigned time',
          id: '1',
        },
        { value: 'Doctor start note', id: '2' },
        { value: 'Doctor signed note', id: '3' },
        { value: 'Doctor signed order', id: '4' },
        { value: 'Doctor changed order', id: '5' },
        { value: 'Discharge order', id: '6' },
        { value: 'Outpatient', id: '7' },
        { value: 'Nurse assigned times', id: '8' },
        { value: 'Nurse start note', id: '9' },
        { value: 'Nurse signed note', id: '10' },
        { value: 'Nurse viewed order', id: '11' },
        { value: 'Order complete', id: '12' },
        { value: 'Medication given', id: '13' },
        { value: 'Dose', id: '14' },
        { value: 'Labs', id: '15' }
      );
      if (e.target.checked == false) {
        _self.state.systemEntryArr = [];
      }
    } else {
      let systemVal = e.target.value;

      _self.state.systemEntryArr.map(function(val, key) {
        if (val.id.toLowerCase() === e.target.dataset.id.toLowerCase()) {
          if (e.target.checked == false) {
            _self.state.systemEntryArr.splice(key, 1);
            systemVal = '';
          }
        }
      });
      if (systemVal !== '') {
        this.state.systemEntryArr.push({
          value: e.target.dataset.name,
          id: e.target.dataset.id,
        });
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    var _self = this;
    var checkLength = $('.check:checked').length;

    if (_self.validator.allValid()) {
      let array = this.state.vitalSignsArr;
      let array1 = this.state.systemEntryArr;
      let imaging = this.state.imagingFilterArr;
      let char = this.state.charFilterArr;
      let documentType = this.state.documentTypeFilterArr;
      const charData = Array.from(new Set(char.map(s => s.name))).map(name => {
        return { name: name };
      });
      const imagingData = Array.from(new Set(imaging.map(s => s.name))).map(
        name => {
          return { name: name };
        }
      );
      const documentTypeData = Array.from(
        new Set(documentType.map(s => s.name))
      ).map(name => {
        return { name: name };
      });
      const vitalSignsArr = Array.from(new Set(array.map(s => s.id))).map(
        id => {
          return {
            id: id,
            value: array.find(s => s.id === id).value,
            name: array.find(s => s.id === id).name,
          };
        }
      );

      const systemEntryArr = Array.from(new Set(array1.map(s => s.id))).map(
        id => {
          return {
            id: id,
            value: array1.find(s => s.id === id).value,
          };
        }
      );
      let patientBasicInfo = {
        mrn: this.state.mrn,
        name: this.state.name,
        dob: this.state.dob,
        gender: this.state.gender,
        vitalSigns: vitalSignsArr,
        systemEntries: systemEntryArr,
        imagingData: imagingData,
        charData: charData,
        documentTypeData: documentTypeData,
        identifier: this.state.identifier,
      };
      checkLength > 0
        ? this.props.history.push({
            pathname: '/chart-review-report',
            data: patientBasicInfo, // your data array of objects
          })
        : alert('Please select atleast one filter');
    } else {
      _self.validator.showMessages();
      _self.forceUpdate();
    }
  };

  render() {
    if (
      Cookies.get('token_id') === undefined ||
      Cookies.get('token') === undefined ||
      Cookies.get('utype') === undefined
    ) {
      this.props.history.push(`/`);
      window.location.reload();
    }
    let option = '';
    if (this.state.gender === 'Male') {
      option = <option selected>Male</option>;
    } else if (this.state.gender === 'Female') {
      option = <option selected>Female</option>;
    }

    return (
      <MDBContainer className="mt-3">
        <MDBRow className="py-3">
          <MDBCol md="12">
            <MDBCard>
              <form onSubmit={this.handleSubmit}>
                <MDBCardHeader color="" tag="h3">
                  Add Chart Review
                  <input
                    className="btn btn-info float-right btn-sm"
                    type="submit"
                    value="Create a report"
                  />
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
                  <h6>
                    Identifier{' '}
                    <div
                      className="span12 text-center text-danger"
                      style={{ 'text-align': 'center' }}
                    >
                      {this.state.message}
                    </div>
                  </h6>
                  <hr />
                  <MDBRow>
                    <MDBCol>
                      <MDBInput
                        id="selectors"
                        type="number"
                        label="MRN"
                        outline
                        onChange={this.patientSearchhandler}
                        value={this.state.mrn}
                        onClick={this.handleInput}
                      />
                      <div className="text-danger">
                        {this.validator.message(
                          'mrn',
                          this.state.mrn,
                          'required'
                        )}
                      </div>
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        label="Identifier"
                        type="text"
                        outline
                        value={this.state.identifier}
                      />
                      <div className="text-danger">
                        {this.validator.message(
                          'identifier',
                          this.state.identifier,
                          'required'
                        )}
                      </div>
                    </MDBCol>
                    <MDBCol md="3">
                      <MDBInput
                        label="Patient Name"
                        type="text"
                        outline
                        value={this.state.name}
                        onChange={this.patientSearchByName}
                        name="patientName"
                      />

                      <div className="text-danger">
                        {this.validator.message(
                          'name',
                          this.state.name,
                          'required'
                        )}
                      </div>
                    </MDBCol>
                    <MDBCol md="">
                      <MDBInput
                        label="Date of birth"
                        type="text"
                        outline
                        value={this.state.dob}
                      />
                      <div className="text-danger">
                        {this.validator.message(
                          'dob',
                          this.state.dob,
                          'required'
                        )}
                      </div>
                    </MDBCol>
                    <MDBCol>
                      <br />
                      <select class="browser-default custom-select">
                        <option value="" disabled selected>
                          Gender
                        </option>
                        {option}
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <div className="text-danger">
                        {this.validator.message(
                          'gender',
                          this.state.gender,
                          'required'
                        )}
                      </div>
                    </MDBCol>
                    <MDBCol>
                      <br />
                      <MDBBtn info size="sm" onClick={this.clearInput}>
                        Clear
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  <div style={this.state.divStyle} class="none">
                    {this.state.patientInfo.map(value => {
                      return (
                        <MDBRow>
                          <MDBCol md="2">
                            <MDBInput
                              label="Medical record number"
                              type="text"
                              outline
                              value={value.patient_mrn}
                              readonly
                            />
                          </MDBCol>
                          <MDBCol md="2">
                            <MDBInput
                              label="Identifier"
                              type="text"
                              outline
                              value={value.patient_identifier}
                              readonly
                            />
                          </MDBCol>
                          <MDBCol md="3">
                            <MDBInput
                              label="Patient name"
                              type="text"
                              outline
                              value={value.patient_name}
                            />
                          </MDBCol>
                          <MDBCol md="2">
                            <MDBInput
                              label="DOB"
                              type="text"
                              outline
                              value={moment(value.patient_dob).format(
                                'MM-DD-YYYY'
                              )}
                            />
                          </MDBCol>
                          <MDBCol md="2">
                            <MDBInput
                              label="Gender"
                              type="text"
                              outline
                              value={value.patient_gender}
                            />
                          </MDBCol>
                          <MDBCol md="1">
                            <br />
                            <input
                              type="radio"
                              class="form-check-input charCheckbox"
                              size="lg"
                              style={checkboxStyle}
                              name="radio"
                              onClick={this.selectPatient.bind(
                                this,
                                value.patient_mrn,
                                value.patient_name,
                                moment(value.patient_dob).format('MM-DD-YYYY'),
                                value.patient_gender,
                                value.patient_identifier
                              )}
                            />
                          </MDBCol>
                        </MDBRow>
                      );
                    })}
                  </div>

                  <MDBRow>
                    <MDBCol>
                      <h6>Patient Characteristics</h6>
                      <hr />
                      <div class="form-check">
                        <input
                          style={checkboxStyle}
                          type="checkbox"
                          class="form-check-input check"
                          size="lg"
                          value="charAll"
                          id="charAll"
                          name="charAll"
                          onChange={this.charChangeHandler}
                        />
                        <label class="form-check-label" for="charAll">
                          Add All Patient Characteristics
                        </label>
                      </div>
                      <MDBCol>
                        {charCheckbox.map((field, index) => {
                          return (
                            <div key={index} class="form-check">
                              <input
                                style={checkboxStyle}
                                type="checkbox"
                                className={`form-check-input charCheckbox ${
                                  field.class
                                }`}
                                id={field.id}
                                size="lg"
                                value={field.value}
                                name={field.name}
                                onChange={this.charChangeHandler}
                              />
                              <label class="form-check-label" for={field.id}>
                                {field.label}
                              </label>
                            </div>
                          );
                        })}
                      </MDBCol>
                    </MDBCol>

                    <MDBCol>
                      <h6>Vital signs</h6>
                      <hr />
                      <div class="form-check">
                        <input
                          style={checkboxStyle}
                          type="checkbox"
                          class="form-check-input check"
                          id="vitalSignSelectAll"
                          size="lg"
                          onChange={this.vitalSignsChangeHandler}
                          value="allValue"
                        />
                        <label
                          class="form-check-label"
                          for="vitalSignSelectAll"
                        >
                          Add All Vital signs
                        </label>
                      </div>
                      <MDBCol>
                        <label class="form-check-label" for="materialInline1">
                          Heart rate, bpm
                        </label>
                        <br />
                        {vitalCheckbox[0].heartRate.map(
                          (innerVal, innerIndex) => {
                            return (
                              <div
                                key={innerIndex}
                                class="form-check form-check-inline"
                              >
                                <input
                                  style={checkboxStyle}
                                  type="checkbox"
                                  class={
                                    'form-check-input vitalSignCheckbox ' +
                                    innerVal.class
                                  }
                                  id={innerVal.id}
                                  value={innerVal.value}
                                  data-id="1"
                                  data-name="HEART RATE ECG"
                                  onChange={this.vitalSignsChangeHandler}
                                />
                                <label
                                  class="form-check-label"
                                  for={innerVal.id}
                                >
                                  {innerVal.label}
                                </label>
                              </div>
                            );
                          }
                        )}
                        <br />
                        <label class="form-check-label" for="bloodpressure">
                          Blood pressure, mm/Hg
                        </label>
                        <br />
                        {vitalCheckbox[0].bloodPessure.map(
                          (innerVal, innerIndex) => {
                            return (
                              <div
                                key={innerIndex}
                                class="form-check form-check-inline"
                              >
                                <input
                                  style={checkboxStyle}
                                  type="checkbox"
                                  class={
                                    'form-check-input vitalSignCheckbox ' +
                                    innerVal.class
                                  }
                                  id={innerVal.id}
                                  value={innerVal.value}
                                  data-id="2"
                                  data-name="blood pressure"
                                  onChange={this.vitalSignsChangeHandler}
                                />
                                <label
                                  class="form-check-label"
                                  for={innerVal.id}
                                >
                                  {innerVal.label}
                                </label>
                              </div>
                            );
                          }
                        )}
                        <label class="form-check-label" for="meanarterial">
                          Mean arterial pressure, mm/Hg
                        </label>
                        <br />
                        {vitalCheckbox[0].meanArterial.map(
                          (innerVal, innerIndex) => {
                            return (
                              <div class="form-check form-check-inline">
                                <input
                                  style={checkboxStyle}
                                  type="checkbox"
                                  class={
                                    'form-check-input vitalSignCheckbox ' +
                                    innerVal.class
                                  }
                                  id={innerVal.id}
                                  value={innerVal.value}
                                  data-id="3"
                                  data-name="R AN ARTERIAL BLOOD PRESSURE"
                                  onChange={this.vitalSignsChangeHandler}
                                />
                                <label
                                  class="form-check-label"
                                  for={innerVal.id}
                                >
                                  {innerVal.label}
                                </label>
                              </div>
                            );
                          }
                        )}
                        <br />
                        <label class="form-check-label" for="respiratoryrate">
                          Respiratory rate, breaths/minute
                        </label>
                        <br />
                        {vitalCheckbox[0].respiratoryRate.map(
                          (innerVal, innerIndex) => {
                            return (
                              <div class="form-check form-check-inline">
                                <input
                                  style={checkboxStyle}
                                  type="checkbox"
                                  className={
                                    'form-check-input vitalSignCheckbox ' +
                                    innerVal.class
                                  }
                                  id={innerVal.id}
                                  value={innerVal.value}
                                  data-id="4"
                                  data-name="RESP RATE"
                                  onChange={this.vitalSignsChangeHandler}
                                />
                                <label
                                  class="form-check-label"
                                  for={innerVal.id}
                                >
                                  {innerVal.label}
                                </label>
                              </div>
                            );
                          }
                        )}
                        <br />
                        <label class="form-check-label" for="o2saturation">
                          O2 saturation, %
                        </label>
                        <br />
                        {vitalCheckbox[0].o2Saturation.map(
                          (innerVal, innerIndex) => {
                            return (
                              <div class="form-check form-check-inline">
                                <input
                                  style={checkboxStyle}
                                  type="checkbox"
                                  className={
                                    'form-check-input vitalSignCheckbox ' +
                                    innerVal.class
                                  }
                                  id={innerVal.id}
                                  value={innerVal.value}
                                  data-id="5"
                                  data-name="Oxygen Saturation"
                                  onChange={this.vitalSignsChangeHandler}
                                />
                                <label
                                  class="form-check-label"
                                  for={innerVal.id}
                                >
                                  {innerVal.label}
                                </label>
                              </div>
                            );
                          }
                        )}
                      </MDBCol>
                    </MDBCol>
                    <MDBCol>
                      <h6>Imaging</h6>
                      <hr />
                      <div class="form-check">
                        <input
                          style={checkboxStyle}
                          type="checkbox"
                          className="form-check-input check"
                          size="lg"
                          id="imagingSelectAll"
                          value="All"
                          onChange={this.imagingChangeHandler}
                        />
                        <label class="form-check-label" for="imagingSelectAll">
                          Add All Imagings
                        </label>
                      </div>
                      <MDBCol>
                        {imaging.map((field, index) => {
                          return (
                            <div class="form-check">
                              <input
                                style={checkboxStyle}
                                type="checkbox"
                                className={`form-check-input imagingCheckbox ${
                                  field.class
                                }`}
                                size="lg"
                                value={field.value}
                                id={field.id}
                                name={field.name}
                                onChange={this.imagingChangeHandler}
                              />
                              <label class="form-check-label" for={field.id}>
                                {field.label}
                              </label>
                            </div>
                          );
                        })}
                      </MDBCol>
                    </MDBCol>
                  </MDBRow>
                  <br />
                  <MDBRow>
                    <MDBCol>
                      <h6>Document Type</h6>
                      <hr />
                      <div class="form-check">
                        <input
                          style={checkboxStyle}
                          type="checkbox"
                          className="form-check-input check"
                          size="lg"
                          id="documentSelectAll"
                          value="All"
                          onChange={this.documentTypeChangeHandler}
                        />
                        <label class="form-check-label" for="documentSelectAll">
                          Add All Document Types
                        </label>
                      </div>
                      <MDBCol>
                        {documentType.map((field, index) => {
                          return (
                            <div class="form-check">
                              <input
                                style={checkboxStyle}
                                type="checkbox"
                                className={`form-check-input documentCheckbox ${
                                  field.class
                                }`}
                                size="lg"
                                id={field.id}
                                value={field.value}
                                name={field.name}
                                onChange={this.documentTypeChangeHandler}
                              />
                              <label class="form-check-label" for={field.id}>
                                {field.label}
                              </label>
                            </div>
                          );
                        })}
                      </MDBCol>
                    </MDBCol>
                    <MDBCol>
                      <h6>System Entries</h6>
                      <hr />
                      <div class="form-check">
                        <input
                          style={checkboxStyle}
                          type="checkbox"
                          class="form-check-input check"
                          id="systemEntriesSelectAll"
                          size="lg"
                          value="All"
                          onChange={this.systemEntriesChangeHandler}
                        />
                        <label
                          class="form-check-label"
                          for="systemEntriesSelectAll"
                        >
                          Add All System Entries
                        </label>
                      </div>
                      <MDBCol>
                        {systemEntries.map((field, index) => {
                          return (
                            <div class="form-check form-check-inline">
                              <input
                                style={checkboxStyle}
                                type="checkbox"
                                className={`form-check-input systemEntriesCheckbox ${
                                  field.class
                                }`}
                                size="lg"
                                id={field.id}
                                value={field.value}
                                data-name={field.data_name}
                                data-id={index}
                                onChange={this.systemEntriesChangeHandler}
                              />
                              <label class="form-check-label" for={field.id}>
                                {field.label}
                              </label>
                            </div>
                          );
                        })}
                      </MDBCol>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </form>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default AddChartReview;
