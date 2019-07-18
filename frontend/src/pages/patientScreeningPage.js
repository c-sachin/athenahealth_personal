/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
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
import '../App.css';
import MembersRow from './membersRow';
import SimpleReactValidator from 'simple-react-validator';
import helpers from '../components/helper';
import update from 'immutability-helper';

const cancelToken = axios.CancelToken;
var cancel;

var searchMinLength = 2;

class PatientScreeningPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screeningName: '',
      resetSearch: null,
      msg: [{ msgLoading: '', msgError: '' }],
      screeningNameErr: '',
      parameterTableValuesData: [],
      parameterSubTableValuesData: [],
      parameterSubTableValuesArray: [],
      paremeterDropdown: [],
      dailyQueryData: [],
      dailyQueryId: '',
      beforeAfterData: [],
      beforeAfterId: '',
      ageValue: '',
      groupCriteria: [],
      parameters: [
        {
          groupCriteriaName: '',
          parameterConditionVal: '',
          parameterCondition: '',
          parameterTable: '',
          parameterTableValue: '',
          parameterTableValuesData: [],
          parameterSubTableValuesData: [],
          parameterSubTableValues: '',
          parameterSubTableDataValues: '',
          parameterSubTableValuesArray: [],
        },
      ],
    };
    this.validator = new SimpleReactValidator();
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
  }

  componentDidMount() {
    let _self = this;
    var token = localStorage.getItem('token');
    var tokenId = localStorage.getItem('token_id');
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}patientSearch/patientQueryList/`,
        null,
        {
          params: {
            session_token: token,
            user_id: tokenId,
          },
        }
      )
      .then(res => {
        const dailyQueryData = res.data.result.dailyQueryList;
        const beforeAfterData = res.data.result.beforeAfterList;
        this.setState({
          dailyQueryData: dailyQueryData,
          beforeAfterData: beforeAfterData,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }
  resetHandler = e => {
    this.setState({ resetSearch: null });
  };
  screenNameChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  changeHandler = e => {
    let groupCriteria = [...this.state.groupCriteria];
    groupCriteria[e.target.dataset.id]['groupName'] = e.target.value;
    this.setState({ groupCriteria });
  };

  handleChange = e => {
    let keyName = e.target.dataset.name;

    if (keyName === 'parameterTable') {
      if (e.target.value !== 7) {
        this.getParameterTableArray(e.target.value, e.target.dataset.id);
      }
    } else if (keyName === 'parameterTableValue') {
      this.getParameterTableValueArray(e.target.value, e.target.dataset.id);
    }
    this.setState({
      parameters: update(this.state.parameters, {
        [e.target.dataset.id]: { [keyName]: { $set: e.target.value } },
      }),
    });
  };

  getParameterTableArray(val, index) {
    this.setState({
      msg: this.msg,
    });
    let token = localStorage.getItem('token');
    let tokeId = localStorage.getItem('token_id');
    let _self = this;
    const obj = {
      parameterTable: val,
    };
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }patientSearch/getParametersTableValues`,
        obj,
        {
          params: { session_token: token, user_id: tokeId },
        }
      )
      .then(res => {
        if (res.data.length > 0) {
          _self.setState({
            parameters: update(_self.state.parameters, {
              [index]: { parameterTableValuesData: { $set: res.data } },
            }),
            msg: this.msgBlank,
          });
        }
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  getParameterTableValueArray(val, index) {
    this.setState({
      msg: this.msg,
    });
    let token = localStorage.getItem('token');
    let tokenId = localStorage.getItem('token_id');
    let _self = this;
    const obj = {
      parameterSubTable: val,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}patientSearch/getSubTableValues`,
        obj,
        {
          params: { session_token: token, user_id: tokenId },
        }
      )
      .then(res => {
        if (res.data.result.length > 0) {
          _self.setState({
            parameters: update(_self.state.parameters, {
              [index]: {
                parameterSubTableValuesData: { $set: res.data.result },
              },
            }),
            msg: this.msgBlank,
          });
        }
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  addGroupCriteria = e => {
    this.setState(prevState => ({
      groupCriteria: [
        ...prevState.groupCriteria,
        {
          groupName: '',
          Parameters: [
            {
              groupCriteriaName: '',
              parameterCondition: '',
              parameterTable: '',
              parameterTableValue: '',
              parameterTableValuesData: [],
              parameterSubTableValues: '',
              parameterSubTableDataValues: '',
              parameterSubTableValuesArray: [],
            },
          ],
        },
      ],
    }));
  };

  handleSubmit = e => {
    var token = localStorage.getItem('token');
    var tokeId = localStorage.getItem('token_id');

    e.preventDefault();
    let _self = this;
    if (this.validator.allValid()) {
      var arrayParameters = this.state.parameters;
      arrayParameters.forEach(function(v) {
        delete v.parameterTableValuesData;
      });

      let payload = {
        screeningName: this.state.screeningName,
        dailyQueryId: this.state.dailyQueryId,
        beforeAfterId: this.state.beforeAfterId,
        patientScreeningData: [
          {
            groupName: '',
            Parameters: [],
          },
        ],
      };
      this.state.parameters.map((value, index) => {
        payload.patientScreeningData[0].Parameters.push({
          groupCriteriaName: value.groupCriteriaName,
          parameterCondition: value.parameterCondition,
          parameterConditionVal: value.parameterConditionVal,
          parameterTable: value.parameterTable,
          parameteerTableValues: value.parameterTableValue,
          parameterSubTableValues: value.parameterSubTableValues,
          parameterSubTableDataValues: value.parameterSubTableDataValues,
        });
      });
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }patientSearch/patientSearchQuery`,
          payload,
          {
            params: {
              session_token: token,
              user_id: tokeId,
            },
          }
        )
        .then(res => {
          alert('New patient screening added successfully');
          this.props.history.push(`/PatientScreening`);
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  parameterTypeChange = e => {
    let _self = this;
    let parameterTable = e.target.dataset.name;
    var parameterTypeValue = e.target.value;

    var index = e.target.dataset.id;
    _self.setState({
      parameters: update(_self.state.parameters, {
        [index]: {
          [parameterTable]: { $set: parameterTypeValue },
          parameterTableValuesData: { $set: [] },
        },
      }),
      resetSearch: index,
    });
  };

  handleVariableValueSearch = e => {
    let _self = this;
    var index = e.target.dataset.id;
    var parameterTable = _self.state.parameters[index].parameterTable;
    var searchText = e.target.value;
    let msg = helpers.setMsg('Fetching data...', '');
    _self.setState({
      msg: msg,
      parameters: update(_self.state.parameters, {
        [index]: { variableValue: { $set: searchText } },
      }),
    });
    searchMinLength = parameterTable == 1 ? 0 : 2;
    if (searchText.length > searchMinLength && parameterTable != '') {
      var apiUrl = helpers.getSearchApiUrlForPsq(
        process.env.REACT_APP_API_BASE_URL,
        parameterTable
      );
      if (apiUrl !== '') {
        cancel && cancel();
        axios
          .get(apiUrl, {
            params: {
              search: searchText,
              interventionType: parameterTable,
            },
            cancelToken: new cancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
            }),
          })
          .then(response => {
            // handle success
            if (response.status === 200 && response.data.status === 'ok') {
              if (response.data.result.count > 0) {
                _self.setState({
                  msg: this.msgBlank,
                  parameters: update(_self.state.parameters, {
                    [index]: {
                      parameterTableValuesData: {
                        $set: response.data.result.data,
                      },
                    },
                  }),
                });
              } else {
                let msg = helpers.setMsg('', response.data.messages.message);
                _self.setState({
                  msg: msg,
                  parameters: update(_self.state.parameters, {
                    [index]: { parameterTableValue: { $set: '' } },
                  }),
                });
              }
            } else {
              let msg = helpers.setMsg('', response.data.errors[0].error);
              _self.setState({
                msg: msg,
                parameters: update(_self.state.parameters, {
                  [index]: { parameterTableValue: { $set: '' } },
                }),
              });
            }
          })
          .catch(err => {
            if (axios.isCancel(err)) {
              console.log('axios request cancelled.');
            } else {
              let msgErr = helpers.errMessage(err);
              _self.setState({
                msg: msgErr,
              });
            }
          });
      } else {
        _self.setState({
          msg: this.msgBlank,
          parameters: update(_self.state.parameters, {
            [index]: { parameterTableValue: { $set: '' } },
          }),
        });
      }
    } else {
      _self.setState({
        msg: this.msgBlank,
        parameters: update(_self.state.parameters, {
          [index]: { parameterTableValue: { $set: '' } },
        }),
      });
    }
  };
  handleAddParameter = e => {
    this.setState(prevState => ({
      parameters: [
        ...prevState.parameters,
        {
          groupCriteriaName: '',
          parameterConditionVal: '',
          parameterCondition: '',
          parameterTable: '',
          parameterTableValue: '',
          parameterTableValuesData: [],
          parameterSubTableValues: '',
          parameterSubTableDataValues: [],
          parameterSubTableValuesData: [],
          parameterSubTableValuesArray: [],
        },
      ],
    }));
  };
  searchValueChangeHandler = e => {
    let keyName = e.target.dataset.name;
    let keyCode = e.target.dataset.code;
    let keyIndex = e.target.dataset.index;
    let _self = this;
    var fieldValue = '';
    if (keyCode != '') {
      fieldValue = keyName + '|' + keyCode;
    } else {
      fieldValue = keyName;
    }

    let msg = helpers.setMsg('', '');
    _self.setState({
      msg: msg,
      parameters: update(_self.state.parameters, {
        [keyIndex]: {
          parameterTableValue: { $set: fieldValue },
          parameterTableValuesData: { $set: [] },
        },
      }),
    });

    this.getParameterTableValueArray(fieldValue, e.target.dataset.index);
  };
  render() {
    if (
      localStorage.getItem('token_id') == undefined ||
      localStorage.getItem('token') == undefined ||
      localStorage.getItem('utype') == undefined
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
                New Patient Screening
                <Link
                  className="btn btn-info float-right btn-sm"
                  to={'/PatientScreening'}
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBCol>
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
                      <MDBCol md="3" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          {' '}
                          Screening Name{' '}
                        </label>
                        <input
                          value={this.state.screeningName}
                          name="screeningName"
                          onChange={this.screenNameChange}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control ${
                            this.state.screeningNameErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="" style={{ color: 'red' }}>
                          {' '}
                          {this.validator.message(
                            'Screening Name',
                            this.state.screeningName,
                            'required'
                          )}{' '}
                        </div>
                      </MDBCol>
                      <MDBCol md="3" className="mb-3">
                        <label htmlFor="dailyQueryId" className="grey-text">
                          Select Daily Query (Optional)
                        </label>
                        <select
                          onChange={this.screenNameChange}
                          type="text"
                          data-name="dailyQueryId"
                          name="dailyQueryId"
                          className={`form-control`}
                          placeholder="Select Daily Query"
                          value={this.state.dailyQueryId}
                        >
                          <option value="">Select Daily Query</option>
                          {this.state.dailyQueryData.map((val, idx) => (
                            <option value={val.pdq_id} key={idx}>
                              {val.pdq_name}
                            </option>
                          ))}
                        </select>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label htmlFor="dailyQueryId" className="grey-text">
                          Select Before / After Analysis (Optional)
                        </label>
                        <select
                          onChange={this.screenNameChange}
                          type="text"
                          data-name="beforeAfterId"
                          name="beforeAfterId"
                          className={`form-control`}
                          placeholder="Select Before / After Analysis"
                          value={this.state.beforeAfterId}
                        >
                          <option value="">
                            Select Before / After Analysis
                          </option>
                          {this.state.beforeAfterData.map((val, idx) => (
                            <option value={val.baa_id} key={idx}>
                              {val.baa_name}
                            </option>
                          ))}
                        </select>
                      </MDBCol>
                      <MDBCol md="2" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text col-md-12"
                        >
                          {' '}
                          &nbsp;{' '}
                        </label>
                        <MDBBtn
                          className="btn-md m-0"
                          color="primary"
                          type="submit"
                        >
                          <i class="fas fa-save fa-fw" /> Save
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol tag="h5">Screening parameters</MDBCol>
                      <MDBCol md="12">
                        <MDBBtn
                          className="btn-sm"
                          color="primary"
                          onClick={this.handleAddParameter}
                        >
                          <i class="fas fa-plus-circle fa-fw" /> Add Parameter
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                    {this.state.parameters.map((val, idx) => {
                      return (
                        <MembersRow
                          key={idx}
                          data={{ value: val, id: idx }}
                          onDelete={this.deleteParameter}
                          onClearValue={this.ClearValue}
                          onChangehandler={this.handleChange}
                          validator={this.validator}
                          parametersLength={this.state.parameters.length}
                          onParameterTypeChangeHandler={
                            this.parameterTypeChange
                          }
                          onVariableSearchCHange={
                            this.handleVariableValueSearch
                          }
                          onSearchValueChangehandler={
                            this.searchValueChangeHandler
                          }
                          reset={this.state.resetSearch}
                          onReset={this.resetHandler}
                        />
                      );
                    })}
                  </form>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default PatientScreeningPage;
