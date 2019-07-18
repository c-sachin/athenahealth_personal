/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import axios from 'axios';
import './reportcheckbox';
import {
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
} from 'mdbreact';
import Cookies from 'js-cookie';
import helpers from '../components/helper';
import moment from 'moment';

class ChartReviewReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeState: true,
      vitalOutput: '',
      sytemEntryOutput: '',
      systemEntryLabs: [],
      mrn: '',
      name: '',
      gender: '',
      dob: '',
      identifier: '',
      msg: [{ msgLoading: '', msgError: '' }],
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
  }
  componentDidMount() {
    var _self = this;
    _self.setState({
      msg: _self.msg,
    });
    const { data } = _self.props.location;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}chartReview/patientFilter/`, {
        patientBasicInfo: data,
      })
      .then(res => {
        let dataResult = res.data.result;
        console.log('\ndataResult: ', dataResult);
        _self.setState({
          msg: _self.msgBlank,
          vitalOutput: dataResult.vitalOutput,
          systemEntryOutput: dataResult.systemEntryOutput,
          imagingData: dataResult.imagingResult,
          documentTypeData: dataResult.documentResult,
          charData: dataResult.charResult,
          mrn: data.mrn,
          gender: data.gender,
          dob: data.dob,
          name: data.name,
          identifier: data.identifier,
          divStyle: { height: '350px', overflowY: 'scroll' },
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  goBack = e => {
    this.props.history.push(`/add-chart-review`);
    window.location.reload();
  };

  handleDropdown = e => {
    if (e.target.value === 'Cluster') {
      this.setState({ changeState: false });
    } else {
      this.setState({ changeState: true });
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
    var labs = [];
    var systemEntries = '';
    if (
      typeof this.state.systemEntryOutput !== 'undefined' &&
      this.state.systemEntryOutput !== ''
    ) {
      systemEntries = this.state.systemEntryOutput.map((fields, innerIndex) => {
        if (
          typeof fields != 'undefined' &&
          fields != '' &&
          Object.keys(fields).length > 0
        ) {
          if (fields.systemEntryName == 'Labs') {
            labs.push(fields.value);
          } else {
            return (
              <tr>
                {this.state.changeState === true ? (
                  <td>
                    {fields.systemEntryTime !== false
                      ? moment(fields.systemEntryTime).format(
                          'MM-DD-YYYY HH:mm'
                        )
                      : ''}
                  </td>
                ) : (
                  ''
                )}
                <td>{fields.systemEntryName}</td>
              </tr>
            );
          }
        }
      });
    } else {
      systemEntries = (
        <tr>
          <td colspan="3">Getting data...</td>
        </tr>
      );
    }
    var labData = [];
    var stoolData = [];
    var urineData = [];
    if (typeof labs !== 'undefined' && labs !== '' && labs.length > 0) {
      labs[0].map((fields, innerIndex) => {
        if (
          fields.labName !== undefined &&
          fields.labName !== '' &&
          Object.keys(fields).length > 0
        ) {
          labData.push(
            <tr>
              {this.state.changeState === true ? (
                <td>
                  {fields.labDate !== false
                    ? moment(fields.labDate).format('MM-DD-YYYY HH:mm')
                    : ''}
                </td>
              ) : (
                ''
              )}
              <td>{fields.labName}</td>
              <td>{fields.labValue}</td>
            </tr>
          );
        }
        if (
          fields.stoolName !== undefined &&
          fields.stoolName !== '' &&
          Object.keys(fields).length > 0
        ) {
          stoolData.push(
            <tr>
              {this.state.changeState === true ? (
                <td>
                  {fields.stoolDate !== false
                    ? moment(fields.stoolDate).format('MM-DD-YYYY HH:mm')
                    : ''}
                </td>
              ) : (
                ''
              )}
              <td conspan="2">{fields.stoolValue}</td>
            </tr>
          );
        }
        if (
          fields.urineName !== undefined &&
          fields.urineName !== '' &&
          Object.keys(fields).length > 0
        ) {
          urineData.push(
            <tr>
              {this.state.changeState === true ? (
                <td>
                  {fields.urineDate !== false
                    ? moment(fields.urineDate).format('MM-DD-YYYY HH:mm')
                    : ''}
                </td>
              ) : (
                ''
              )}
              <td conspan="2">{fields.urineValue}</td>
            </tr>
          );
        }
        return [labData, stoolData, urineData];
      });
    }
    return (
      <MDBContainer className="mt-3">
        <MDBRow className="py-3">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Chart Review Report
                <MDBBtn
                  className="btn btn-info float-right btn-sm"
                  onClick={this.goBack}
                >
                  <i className="fas fa-undo fa-fw" /> Back
                </MDBBtn>
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
                <h6>Identifier</h6>
                <hr />
                <MDBRow>
                  <MDBCol>
                    <MDBInput
                      label="Identifier"
                      type="text"
                      value={this.state.identifier}
                      outline
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Patient Name"
                      type="text"
                      value={this.state.name}
                      outline
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Date of birth"
                      value={this.state.dob}
                      outline
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      type="text"
                      label="Gender"
                      outline
                      value={this.state.gender}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      type="text"
                      label="Medical record number"
                      value={this.state.mrn}
                      outline
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="3">
                    <h6>Display as</h6>
                    <select
                      className="browser-default custom-select"
                      onChange={this.handleDropdown}
                    >
                      <option>Choose your option</option>
                      <option selected>Timeline</option>
                      <option>Cluster</option>
                    </select>
                  </MDBCol>
                </MDBRow>
                <hr />
                {this.state.charData !== undefined &&
                (JSON.stringify(this.state.charData[0]) !== '{}' &&
                  this.state.charData > 0) ? (
                  <MDBRow>
                    <MDBCol>
                      <h5>Patient Characteristics</h5>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
                <MDBRow>
                  {this.state.charData !== undefined &&
                  this.state.charData !== ''
                    ? this.state.charData.map(element => {
                        return element.data.map(innerElement => {
                          if (innerElement.dob) {
                            return (
                              <MDBCol>
                                <ul>
                                  <li>DOB: {innerElement.dob}</li>
                                </ul>
                              </MDBCol>
                            );
                          }
                          if (innerElement.MedicalHistory) {
                            return (
                              <MDBCol md="12">
                                <ul>
                                  <li>Past Medical History</li>
                                  <ul>
                                    {innerElement.MedicalHistory.map(
                                      tableElement => {
                                        return (
                                          <li>{tableElement.Immunization}</li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </ul>
                              </MDBCol>
                            );
                          }

                          if (innerElement.allergy) {
                            return (
                              <MDBCol>
                                <ul>
                                  <li>Allergies</li>
                                  <ul>
                                    <li>
                                      Name: {innerElement.allergy.allergyName}
                                    </li>
                                    <li>
                                      Reaction:{' '}
                                      {innerElement.allergy.allergyReaction}
                                    </li>
                                    <li>
                                      Type: {innerElement.allergy.allergyType}
                                    </li>
                                  </ul>
                                </ul>
                              </MDBCol>
                            );
                          }
                          if (innerElement.surgicalHistory) {
                            return (
                              <MDBCol>
                                <ul>
                                  <li>Surgical History</li>
                                  <ul>
                                    <li>
                                      Name: {innerElement.surgicalHistory}
                                    </li>
                                  </ul>
                                </ul>
                              </MDBCol>
                            );
                          }
                          if (innerElement.SocialHistory) {
                            return (
                              <MDBCol>
                                <ul>
                                  <li>Socal History</li>
                                  <ul>
                                    <li>
                                      Smoking status:{' '}
                                      {
                                        innerElement.SocialHistory
                                          .SmokingStatus[0]
                                      }
                                    </li>
                                    <li>
                                      Drinking alcohol:{' '}
                                      {
                                        innerElement.SocialHistory
                                          .drinkAlcohol[0]
                                      }
                                    </li>
                                  </ul>
                                </ul>
                              </MDBCol>
                            );
                          }

                          if (innerElement.MedicationTaken) {
                            return (
                              <MDBCol md="12" style={this.state.divStyle}>
                                <MDBTable bordered>
                                  <MDBTableHead>
                                    <tr>
                                      {this.state.changeState === true ? (
                                        <th>Date and time</th>
                                      ) : (
                                        ''
                                      )}
                                      <th scope="col">Medication taken</th>
                                      <th scope="col">Quantity</th>
                                    </tr>
                                  </MDBTableHead>
                                  <MDBTableBody>
                                    {innerElement.MedicationTaken.map(
                                      tableElement => {
                                        return (
                                          <tr>
                                            {this.state.changeState === true ? (
                                              <td>
                                                {tableElement.MedicationStartDate !==
                                                false
                                                  ? moment(
                                                      tableElement.MedicationStartDate
                                                    ).format('MM-DD-YYYY HH:mm')
                                                  : ''}
                                              </td>
                                            ) : (
                                              ''
                                            )}
                                            <td>
                                              {tableElement.MedicationName}
                                            </td>
                                            <td>
                                              {tableElement.MedicationQuantity}{' '}
                                              {tableElement.MedicationDoseUnit}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </MDBTableBody>
                                </MDBTable>
                              </MDBCol>
                            );
                          }
                        });
                      })
                    : ''}
                </MDBRow>
                {this.state.vitalOutput !== undefined &&
                this.state.vitalOutput !== '' &&
                this.state.vitalOutput.length > 0 ? (
                  <MDBRow>
                    <MDBCol>
                      <h5>Vital signs</h5>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
                {this.state.vitalOutput !== undefined &&
                this.state.vitalOutput !== '' ? (
                  <MDBRow>
                    {typeof this.state.vitalOutput != undefined &&
                    this.state.vitalOutput !== ''
                      ? this.state.vitalOutput.map(innerVal => {
                          if (Object.keys(innerVal).length > 0)
                            return (
                              <MDBCol md="6">
                                <label
                                  class="form-check-label"
                                  for="materialInline1"
                                >
                                  {typeof innerVal.name != undefined
                                    ? innerVal.name.toUpperCase()
                                    : ''}
                                </label>
                                <br />
                                <MDBTable small>
                                  <MDBTableHead>
                                    <tr>
                                      <th>
                                        {typeof innerVal.name != undefined &&
                                        innerVal.name !== ''
                                          ? innerVal.name.toLowerCase() ===
                                            'blood pressure'
                                            ? 'Systolic'
                                            : 'Lowest'
                                          : ''}
                                      </th>
                                      <th>
                                        {typeof innerVal.name != undefined &&
                                        innerVal.name !== ''
                                          ? innerVal.name.toLowerCase() ===
                                            'blood pressure'
                                            ? 'Diastolic'
                                            : 'Highest'
                                          : ''}
                                      </th>
                                      <th>All</th>
                                    </tr>
                                  </MDBTableHead>
                                  <MDBTableBody>
                                    {innerVal.id !== 2 ? (
                                      <tr>
                                        {
                                          <td>
                                            <table className="table-bordered ">
                                              {typeof innerVal.lowestValue !=
                                                undefined &&
                                              innerVal.lowestValue != null &&
                                              innerVal.lowestValue.length ===
                                                1 ? (
                                                <tr>
                                                  {this.state.changeState ? (
                                                    <td>
                                                      {innerVal.lowestValue[0]
                                                        .date !== false
                                                        ? moment(
                                                            innerVal
                                                              .lowestValue[0]
                                                              .date
                                                          ).format(
                                                            'MM-DD-YYYY HH:mm'
                                                          )
                                                        : ''}
                                                    </td>
                                                  ) : (
                                                    ''
                                                  )}
                                                  <td>
                                                    {
                                                      innerVal.lowestValue[0]
                                                        .value
                                                    }
                                                  </td>
                                                </tr>
                                              ) : (
                                                ''
                                              )}
                                            </table>
                                          </td>
                                        }
                                        {
                                          <td>
                                            <table className="table-bordered ">
                                              {' '}
                                              {typeof innerVal.higestValue !==
                                                undefined &&
                                              innerVal.higestValue !== null &&
                                              innerVal.higestValue.length ===
                                                1 ? (
                                                <tr>
                                                  {this.state.changeState ? (
                                                    <td>
                                                      {innerVal.higestValue[0]
                                                        .date !== false
                                                        ? moment(
                                                            innerVal
                                                              .higestValue[0]
                                                              .date
                                                          ).format(
                                                            'MM-DD-YYYY HH:mm'
                                                          )
                                                        : ''}
                                                    </td>
                                                  ) : (
                                                    ''
                                                  )}
                                                  <td>
                                                    {
                                                      innerVal.higestValue[0]
                                                        .value
                                                    }
                                                  </td>
                                                </tr>
                                              ) : (
                                                ''
                                              )}
                                            </table>
                                          </td>
                                        }
                                        {
                                          <MDBTable bordered>
                                            <MDBTableBody>
                                              {typeof innerVal.all !==
                                                undefined &&
                                              innerVal.all !== null
                                                ? innerVal.all.map(
                                                    (innerVal, innerIndex) => {
                                                      return (
                                                        <tr>
                                                          {this.state
                                                            .changeState ===
                                                          true ? (
                                                            <td>
                                                              {innerVal.date !==
                                                              false
                                                                ? moment(
                                                                    innerVal.date
                                                                  ).format(
                                                                    'MM-DD-YYYY HH:mm'
                                                                  )
                                                                : ''}
                                                            </td>
                                                          ) : (
                                                            ''
                                                          )}
                                                          <td>
                                                            {innerVal.value}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )
                                                : ''}
                                            </MDBTableBody>
                                          </MDBTable>
                                        }
                                      </tr>
                                    ) : (
                                      <tr>
                                        {
                                          <td>
                                            <table className="table-bordered">
                                              {typeof innerVal.lowestValue !=
                                                undefined &&
                                              innerVal.lowestValue !== null &&
                                              innerVal.lowestValue !== ''
                                                ? innerVal.lowestValue.map(
                                                    innerVal => {
                                                      return (
                                                        <tr>
                                                          {this.state
                                                            .changeState ===
                                                          true ? (
                                                            <td>
                                                              {innerVal.date !==
                                                              false
                                                                ? moment(
                                                                    innerVal.date
                                                                  ).format(
                                                                    'MM-DD-YYYY HH:mm'
                                                                  )
                                                                : ''}
                                                            </td>
                                                          ) : (
                                                            ''
                                                          )}
                                                          <td>
                                                            {innerVal.value}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )
                                                : ''}
                                            </table>
                                          </td>
                                        }
                                        {
                                          <td>
                                            <table className="table-bordered">
                                              {typeof innerVal.higestValue !=
                                                undefined &&
                                              innerVal.higestValue !== null &&
                                              innerVal.higestValue !== ''
                                                ? innerVal.higestValue.map(
                                                    innerVal => {
                                                      return (
                                                        <tr>
                                                          {this.state
                                                            .changeState ===
                                                          true ? (
                                                            <td>
                                                              {innerVal.date !==
                                                              false
                                                                ? moment(
                                                                    innerVal.date
                                                                  ).format(
                                                                    'MM-DD-YYYY HH:mm'
                                                                  )
                                                                : ''}
                                                            </td>
                                                          ) : (
                                                            ''
                                                          )}
                                                          <td>
                                                            {innerVal.value}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )
                                                : ''}
                                            </table>
                                          </td>
                                        }
                                        {
                                          <td>
                                            <table className="table-bordered">
                                              {typeof innerVal.all !==
                                                undefined &&
                                              innerVal.all !== null
                                                ? innerVal.all.map(innerVal => {
                                                    return (
                                                      <tr>
                                                        {this.state
                                                          .changeState ===
                                                        true ? (
                                                          <td>
                                                            {innerVal.date !==
                                                            false
                                                              ? moment(
                                                                  innerVal.date
                                                                ).format(
                                                                  'MM-DD-YYYY HH:mm'
                                                                )
                                                              : ''}
                                                          </td>
                                                        ) : (
                                                          ''
                                                        )}
                                                        <td>
                                                          {innerVal.value}
                                                        </td>
                                                      </tr>
                                                    );
                                                  })
                                                : ''}{' '}
                                            </table>
                                          </td>
                                        }
                                      </tr>
                                    )}
                                  </MDBTableBody>
                                </MDBTable>
                              </MDBCol>
                            );
                        })
                      : ''}
                  </MDBRow>
                ) : (
                  ''
                )}
                {this.state.systemEntryOutput !== undefined &&
                this.state.systemEntryOutput !== '' &&
                this.state.systemEntryOutput.length > 0 ? (
                  <MDBRow>
                    <MDBCol>
                      <h5>System Entries</h5>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
                <MDBRow>
                  <MDBCol md="4">
                    {this.state.systemEntryOutput !== undefined &&
                    this.state.systemEntryOutput !== '' &&
                    this.state.systemEntryOutput.length > 0 ? (
                      <div>
                        <MDBTable bordered>
                          <MDBTableHead>
                            <tr>
                              {this.state.changeState ? (
                                <th scope="col">Date and time</th>
                              ) : (
                                ''
                              )}
                              <th scope="col">System Entry</th>
                            </tr>
                          </MDBTableHead>
                          <MDBTableBody>{systemEntries}</MDBTableBody>
                        </MDBTable>
                        {labData != '' ? (
                          <MDBTable bordered>
                            <MDBTableHead>
                              <tr>
                                {this.state.changeState ? (
                                  <th scope="col">Date and time</th>
                                ) : (
                                  ''
                                )}
                                <th scope="col">Lab</th>
                                <th scope="col">Output</th>
                              </tr>
                            </MDBTableHead>
                            <MDBTableBody>{labData}</MDBTableBody>
                          </MDBTable>
                        ) : (
                          ''
                        )}
                        {stoolData !== '' ? (
                          <MDBTable bordered>
                            <MDBTableHead>
                              <tr>
                                {this.state.changeState ? (
                                  <th scope="col">Date and time</th>
                                ) : (
                                  ''
                                )}
                                <th scope="col" conspan="2">
                                  Stool Output
                                </th>
                              </tr>
                            </MDBTableHead>
                            <MDBTableBody>{stoolData}</MDBTableBody>
                          </MDBTable>
                        ) : (
                          ''
                        )}
                        {urineData !== '' ? (
                          <MDBTable bordered>
                            <MDBTableHead>
                              <tr>
                                {this.state.changeState ? (
                                  <th scope="col">Date and time</th>
                                ) : (
                                  ''
                                )}
                                <th scope="col" conspan="2">
                                  Urine Output
                                </th>
                              </tr>
                            </MDBTableHead>
                            <MDBTableBody>{urineData}</MDBTableBody>
                          </MDBTable>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </MDBCol>
                </MDBRow>
                {this.state.imagingData !== undefined &&
                this.state.imagingData !== '' &&
                (JSON.stringify(this.state.imagingData) !== '[]' &&
                  JSON.stringify(this.state.imagingData[0]) !== '{}') ? (
                  <MDBRow>
                    <MDBCol>
                      <h5>Imaging</h5>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
                {this.state.imagingData !== undefined &&
                this.state.imagingData !== '' &&
                (JSON.stringify(this.state.imagingData) !== '[]' &&
                  JSON.stringify(this.state.imagingData[0]) !== '{}') ? (
                  <MDBRow>
                    <MDBCol>
                      <MDBTable bordered>
                        <MDBTableHead>
                          <tr>
                            {this.state.changeState === true ? (
                              <th>Date and time</th>
                            ) : (
                              ''
                            )}
                            <th>Imaging</th>
                            <th>Note</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {this.state.imagingData !== undefined &&
                          this.state.imagingData !== ''
                            ? this.state.imagingData.map((element, index) => {
                                if (JSON.stringify(element) !== '{}') {
                                  return (
                                    <tr>
                                      {this.state.changeState === true ? (
                                        <th>
                                          {element.dateAndTime !== false
                                            ? moment(
                                                element.dateAndTime
                                              ).format('MM-DD-YYYY HH:mm')
                                            : ''}
                                        </th>
                                      ) : (
                                        ''
                                      )}
                                      <th>{element.type}</th>
                                      <th>{element.note}</th>
                                    </tr>
                                  );
                                }
                              })
                            : ''}
                        </MDBTableBody>
                      </MDBTable>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
                {this.state.documentTypeData !== undefined &&
                (JSON.stringify(this.state.documentTypeData[0]) !== '{}' &&
                  JSON.stringify(this.state.documentTypeData) !== '[]') ? (
                  <MDBRow>
                    <MDBCol>
                      <h5>Document Type</h5>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
                {this.state.documentTypeData !== undefined &&
                this.state.documentTypeData !== '' &&
                (JSON.stringify(this.state.documentTypeData[0]) !== '{}' &&
                  JSON.stringify(this.state.documentTypeData) !== '[]') ? (
                  <MDBRow>
                    <MDBCol>
                      <MDBTable bordered>
                        <MDBTableHead>
                          <tr>
                            <th>Date and time</th>
                            <th>Document Type</th>
                            <th>Note</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {this.state.documentTypeData !== undefined &&
                          this.state.documentTypeData !== ''
                            ? this.state.documentTypeData.map(
                                (element, index) => {
                                  if (JSON.stringify(element) !== '{}') {
                                    return (
                                      <tr>
                                        <th>
                                          {element.dateAndTime !== false
                                            ? moment(
                                                element.dateAndTime
                                              ).format('MM-DD-YYYY HH:mm')
                                            : ''}
                                        </th>
                                        <th>{element.type}</th>
                                        <th>{element.note}</th>
                                      </tr>
                                    );
                                  }
                                }
                              )
                            : ''}
                        </MDBTableBody>
                      </MDBTable>
                    </MDBCol>
                  </MDBRow>
                ) : (
                  ''
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
export default ChartReviewReport;
