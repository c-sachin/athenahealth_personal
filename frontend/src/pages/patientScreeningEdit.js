/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
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
import ParameterRowEdit from './parameterRowEdit';
import Cookies from 'js-cookie';
import SimpleReactValidator from 'simple-react-validator';
import update from 'immutability-helper';
import helpers from '../components/helper';

const cancelToken = axios.CancelToken;
var cancel;

var searchMinLength = 2;

class PatientScreeningEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      screeningName: '',
      parameters: [],
      dailyQueryData: [],
      dailyQueryId: '',
      beforeAfterData: [],
      beforeAfterId: '',
      resetSearch: null,
    };
    this.validator = new SimpleReactValidator();
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgBlank = helpers.setMsg('', '');
    this.msgUpdate = helpers.setMsg('Updating Data...', '');
  }

  componentDidMount() {
    this.setState({
      msg: this.msg,
    });
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    let _self = this;

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
        _self.setState({
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

    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }patientSearch/patientScreeningEdit/` + this.props.match.params.id,
        null,
        { params: { session_token: token, user_id: tokenId } }
      )
      .then(response => {
        let data = response.data.result;
        _self.setState({
          screeningName: data[0].psqName,
          parameters: data,
          dailyQueryId: data[0].psqDailyQueryId,
          beforeAfterId: data[0].psqBeforeAfterId,
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

  resetHandler = e => {
    this.setState({ resetSearch: null });
  };

  handleAddParameter = e => {
    const parameters = [...this.state.parameters];
    parameters[parameters.length] = {
      psqcCriterionName: '',
      parameterCondition: '',
      parameterTable: '',
      parameterTableValue: '',
      parameterTableValueCondition: '',
      parameterTableValueConditionValue: '',
      psqcCriterionCondition: '',
      parameterSubTableValuesData: [],
      parameterTableValuesData: [],
    };
    this.setState({ parameters });
  };

  handleSubmit = e => {
    e.preventDefault();
    let _self = this;
    this.setState({
      msg: this.msgUpdate,
    });
    if (this.validator.allValid()) {
      let token = localStorage.getItem('token');
      let tokenId = localStorage.getItem('token_id');
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
        if (typeof value.psqc_criterion_id == 'undefined') {
          value.psqc_criterion_id = 0;
        }
        payload.patientScreeningData[0].Parameters.push({
          paramertCriterionId: value.psqc_criterion_id,
          paramertCriterionGroupId: value.psqcGroupId,
          parameteerTableValues: value.parameterTableValue,
          parameterCondition: value.parameterCondition,
          parameterConditionVal: value.psqcCriterionCondition,
          parameterSubTableDataValues: value.parameterTableValueConditionValue,
          parameterSubTableValues: value.parameterTableValueCondition,
          parameterTable: value.parameterTable,
          psqcCriterionName: value.psqcCriterionName,
        });
      });
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }patientSearch/patientScreeningUpdate/` + this.props.match.params.id,
          payload,
          {
            params: { session_token: token, user_id: tokenId },
          }
        )
        .then(res => {
          alert('Patient screening updated successfully');
          this.props.history.push(`/PatientScreening`);
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
    } else {
      this.setState({
        msg: this.msgBlank,
      });
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  screenNameChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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

  parameterTypeChange = e => {
    let _self = this;
    let parameterTable = e.target.dataset.name;
    var parameterTypeValue = e.target.value;

    var index = e.target.dataset.id;
    _self.setState({
      parameters: update(_self.state.parameters, {
        [index]: {
          [parameterTable]: { $set: parameterTypeValue },
          parameterTableValue: { $set: '' },
          parameterTableValuesData: { $set: [] },
        },
      }),
      resetSearch: index,
    });
  };
  handleVariableValueSearch = e => {
    let msgBlank = helpers.setMsg('', '');
    let _self = this;
    var index = e.target.dataset.id;

    var parameterTable = _self.state.parameters[index].parameterTable;
    var searchText = e.target.value;
    let msg = helpers.setMsg('Fetching data...', '');
    _self.setState({
      msg: msg,
      parameters: update(_self.state.parameters, {
        [index]: {
          parameterTableValue: { $set: searchText },
          parameterTableValuesData: { $set: [] },
        },
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
                  msg: msgBlank,
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
          msg: msgBlank,
          parameters: update(_self.state.parameters, {
            [index]: { parameterTableValue: { $set: '' } },
          }),
        });
      }
    } else {
      _self.setState({
        msg: msgBlank,
        parameters: update(_self.state.parameters, {
          [index]: {
            parameterTableValue: { $set: '' },
            parameterTableValuesData: { $set: [] },
          },
        }),
      });
    }
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

  deleteParameter = e => {
    let parameters = this.state.parameters;
    let id = parseInt(e.target.dataset.id);
    if (parameters.length > 1) {
      if (id !== 0) {
        var conditionValue = parameters[id]['psqcCriterionCondition'];
        parameters.splice(id, 1);
        this.setState({
          parameters: update(this.state.parameters, {
            [id - 1]: {
              psqcCriterionCondition: {
                $set: conditionValue,
              },
            },
          }),
        });
      } else {
        parameters.splice(id, 1);
        this.setState({
          parameters,
        });
      }
    } else {
      alert('Atleast One parameter required');
    }
  };

  render() {
    return (
      <MDBContainer className="mt-5">
        <MDBRow className="my-5">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Edit Patient Screening
                <Link
                  class="btn btn-info float-right btn-sm"
                  to={'/PatientScreening'}
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
                      <MDBCol md="12">
                        {' '}
                        {this.state.msg[0].msgLoading !== '' ? (
                          <p className="text-center">
                            {' '}
                            {this.state.msg[0].msgLoading}{' '}
                            <i class="fa fa-spinner fa-pulse fa-fw" />
                          </p>
                        ) : (
                          ''
                        )}{' '}
                        {this.state.msg[0].msgError !== '' ? (
                          <p className="text-center text-danger">
                            <i class="fa fa-exclamation-triangle fa-fw" />{' '}
                            {this.state.msg[0].msgError}{' '}
                          </p>
                        ) : (
                          ''
                        )}{' '}
                      </MDBCol>
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
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Select Daily Query(Optional)
                        </label>
                        <select
                          onChange={this.screenNameChange}
                          type="text"
                          data-name="dailyQueryId"
                          name="dailyQueryId"
                          className={`form-control`}
                          placeholder="Select Daily Query(Optional)"
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
                        <label htmlFor="beforeAfterId" className="grey-text">
                          Select Before / After Analysis (Optional)
                        </label>
                        <select
                          onChange={this.screenNameChange}
                          type="text"
                          data-name="beforeAfterId"
                          name="beforeAfterId"
                          className={`form-control`}
                          placeholder="Select Before / After Analysis (Optional)"
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
                          <i class="fas fa-save fa-fw" /> Update
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol tag="h5"> Screening parameters </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="12">
                        <MDBBtn
                          className="btn-sm"
                          color="primary"
                          onClick={this.handleAddParameter}
                        >
                          <i class="fas fa-plus-circle fa-fw" /> Add Parameter
                        </MDBBtn>
                      </MDBCol>
                      {this.state.parameters.map((val, idx) => {
                        return (
                          <ParameterRowEdit
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
                    </MDBRow>
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

export default PatientScreeningEdit;
