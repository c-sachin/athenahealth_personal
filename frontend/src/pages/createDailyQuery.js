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
import VariableRow from './variableRow';
import update from 'immutability-helper';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';
import helpers from '../components/helper';

const cancelToken = axios.CancelToken;
var cancel;

var searchMinLength = 2;

class CreateDailyQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      resetSearch: null,
      variableName: '',
      queryFrequency: '',
      variables: [
        {
          variableType: '',
          variableValueData: [],
          variableValue: '',
          variableRangeValue: '',
          variableRangeData: [],
          variablePeriod: '',
          variableDate: new Date(),
        },
      ],
    };
    this.validator = new SimpleReactValidator();
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgBlank = helpers.setMsg('', '');
    this.msgAdd = helpers.setMsg('Adding Data...', '');
  }

  variableNameChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  resetHandler = e => {
    this.setState({ resetSearch: null });
  };
  getVariableTable(val, index) {
    let token = localStorage.getItem('token');
    let tokenId = localStorage.getItem('token_id');
    let _self = this;
    const obj = {
      variableType: val,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}dailyquery/getVariableValues`,
        obj,
        {
          params: { session_token: token, user_id: tokenId },
        }
      )
      .then(res => {
        if (res.data.result.length > 0) {
          _self.setState({
            variables: update(_self.state.variables, {
              [index]: { variableValueData: { $set: res.data.result } },
            }),
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
  getVariableRange(val, index) {
    let token = localStorage.getItem('token');
    let tokenId = localStorage.getItem('token_id');
    let _self = this;
    const obj = {
      variableType: val,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}dailyquery/getVariableRange`,
        obj,
        {
          params: { session_token: token, user_id: tokenId },
        }
      )
      .then(res => {
        if (res.data.result.length > 0) {
          _self.setState({
            variables: update(_self.state.variables, {
              [index]: { variableRangeData: { $set: res.data.result } },
            }),
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
  handleAddVariable = e => {
    const variables = [...this.state.variables];
    variables[variables.length] = {
      variableType: '',
      variableValueData: [],
      variableValue: '',
      variableRangeValue: '',
      variableRangeData: [],
      variablePeriod: '',
      variableDate: new Date(),
    };
    this.setState({ variables });
  };

  handleChange = e => {
    let keyName = e.target.dataset.name;

    if (keyName === 'variableType') {
      this.getVariableTable(e.target.value, e.target.dataset.id);
    }
    if (keyName === 'variableValue') {
      this.getVariableRange(e.target.value, e.target.dataset.id);
    }
    this.setState({
      variables: update(this.state.variables, {
        [e.target.dataset.id]: { [keyName]: { $set: e.target.value } },
      }),
    });
  };
  handleDatePicker = (e, id, name) => {
    this.setState({
      variables: update(this.state.variables, {
        [id]: { [name]: { $set: e } },
      }),
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    var _self = this;
    _self.setState({
      msg: _self.msgAdd,
    });
    if (_self.validator.allValid()) {
      let token = localStorage.getItem('token');
      let tokenId = localStorage.getItem('token_id');
      let payload = {
        variableName: _self.state.variableName,
        queryFrequency: _self.state.queryFrequency,
        variables: [],
      };

      // eslint-disable-next-line array-callback-return
      _self.state.variables.map((value, index) => {
        payload.variables.push({
          variableType: value.variableType,
          variableValue: value.variableValue,
          variableRangeValue: value.variableRangeValue,
          variableDate: value.variableDate,
          variablePeriod: value.variablePeriod,
        });
      });
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }dailyquery/patientDailyQueryAdd`,
          payload,
          { params: { session_token: token, user_id: tokenId } }
        )
        .then(res => {
          alert('Patient daily query added successfully');
          _self.props.history.push(`/dailyquery`);
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
      });
      _self.validator.showMessages();
      _self.forceUpdate();
    }
  };

  handleVariableTypeChange = e => {
    let _self = this;
    var variableTypeValue = e.target.value;
    var variableTypeIndex = e.target.id;
    _self.setState({
      variables: update(_self.state.variables, {
        [variableTypeIndex]: {
          variableType: { $set: variableTypeValue },
          variableValueData: { $set: [] },
        },
      }),
      resetSearch: variableTypeIndex,
    });
    _self.getVariableRange(variableTypeValue, variableTypeIndex);
  };

  handleVariableValueSearch = e => {
    let msgBlank = helpers.setMsg('', '');
    let _self = this;
    var variableValueIndex = e.target.dataset.id;
    var variableType = _self.state.variables[variableValueIndex].variableType;
    var searchText = e.target.value;
    let msg = helpers.setMsg('Fetching data...', '');
    _self.setState({
      msg: msg,
      variables: update(_self.state.variables, {
        [variableValueIndex]: { variableValue: { $set: searchText } },
      }),
    });
    searchMinLength = variableType == 5 ? 0 : 2;
    if (searchText.length > searchMinLength && variableType != '') {
      var apiUrl = helpers.getSearchApiUrl(
        process.env.REACT_APP_API_BASE_URL,
        variableType
      );
      if (apiUrl !== '') {
        cancel && cancel();
        axios
          .get(apiUrl, {
            params: {
              search: searchText,
              interventionType: variableType,
            },
            cancelToken: new cancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
            }),
          })
          .then(response => {
            // handle success
            _self.setState({
              msg: msgBlank,
              variables: update(_self.state.variables, {
                [variableValueIndex]: {
                  variableValueData: { $set: response.data.result.data },
                },
              }),
            });
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
          variables: update(_self.state.variables, {
            [variableValueIndex]: { variableValue: { $set: '' } },
          }),
        });
      }
    } else {
      _self.setState({
        msg: msgBlank,
        variables: update(_self.state.variables, {
          [variableValueIndex]: { variableValue: { $set: '' } },
        }),
      });
    }
  };

  searchVariableValueChangeHandler = e => {
    let keyName = e.target.dataset.name;
    let keyCode = e.target.dataset.code;
    let keyIndex = e.target.dataset.index;
    let _self = this;
    var variableValue = '';
    if (keyCode != '') {
      variableValue = keyName + '|' + keyCode;
    } else {
      variableValue = keyName;
    }
    let msg = helpers.setMsg('', '');
    _self.setState({
      msg: msg,
      variables: update(_self.state.variables, {
        [keyIndex]: {
          variableValue: { $set: variableValue },
          variableValueData: { $set: [] },
        },
      }),
    });
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
                New Patient Daily Query
                <Link
                  className="btn btn-info float-right btn-sm"
                  to={'/dailyquery'}
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
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          New Query Name
                        </label>
                        <input
                          value={this.state.variableName}
                          name="variableName"
                          onChange={this.variableNameChange}
                          type="text"
                          className={`form-control ${
                            this.state.screeningNameErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="" style={{ color: 'red' }}>
                          {' '}
                          {this.validator.message(
                            'Variable Name',
                            this.state.variableName,
                            'required'
                          )}{' '}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Query Frequency
                        </label>

                        <select
                          onChange={this.variableNameChange}
                          type="text"
                          name="queryFrequency"
                          className={`form-control`}
                          placeholder="Query frequency"
                          required={true}
                          value={this.state.queryFrequency}
                        >
                          <option value="">Select Frequency of query</option>
                          <option value="1">Daily</option>
                          <option value="2">Weekly</option>
                          <option value="3">Yearly</option>
                        </select>
                        <div className="" style={{ color: 'red' }}>
                          {' '}
                          {this.validator.message(
                            'Query Frequency',
                            this.state.queryFrequency,
                            'required'
                          )}{' '}
                        </div>
                      </MDBCol>

                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text col-md-12"
                        />
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
                      <MDBCol tag="h5">Variable parameters</MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="12">
                        <MDBBtn
                          className="btn-sm"
                          color="primary"
                          onClick={this.handleAddVariable}
                        >
                          <i class="fas fa-plus-circle fa-fw" /> Add Variable
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      {this.state.variables.map((val, idx) => {
                        return (
                          <VariableRow
                            key={idx}
                            data={{
                              value: val,
                              id: idx,
                              defaultVariables: this.state.variables,
                            }}
                            onChangehandler={this.handleChange}
                            onVariableTypeChangeHandler={
                              this.handleVariableTypeChange
                            }
                            onVariableSearchCHange={
                              this.handleVariableValueSearch
                            }
                            onSearchVariableValueChangehandler={
                              this.searchVariableValueChangeHandler
                            }
                            onDatepickerChangeHandler={this.handleDatePicker}
                            validator={this.validator}
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

export default CreateDailyQuery;
