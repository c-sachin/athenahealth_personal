/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBNavLink,
} from 'mdbreact';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';
import Suggestions from '../components/searchSuggestions';
import Cookies from 'js-cookie';
import helpers from '../components/helper';

const cancelToken = axios.CancelToken;
var cancel; // Cancel token for search request
var cancel1; // Cancel token for variable range request

var searchMinLength = 2;

class EditBeforeAfterAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      msg: [{ msgLoading: '', msgError: '' }],
      reportName: '',
      reportId: '',
      queryFrequency: '',
      variables: [],
      showInterventionSearchResult: false,
      interventionType: '',
      interventionValueData: [],
      interventionValue: '',
      showMeasureSearchResult: false,
      measureType: '',
      measureValueData: [],
      measureValue: '',
      showMeasureRange: false,
      variableRangeValue: '',
      variableRangeData: [],
    };

    this.validator = new SimpleReactValidator({
      default: 'This field is required.',
    });
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgBlank = helpers.setMsg('', '');
    this.msgUpdate = helpers.setMsg('Updating Data...', '');
  }

  componentDidMount() {
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    let _self = this;
    _self.setState({
      msg: _self.msg,
    });
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }before-after-analysis/beforeAfterEdit/` + _self.props.match.params.id,
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
        _self.setState({
          msg: _self.msgBlank,
          reportName: data.reportName,
          reportId: data.reportId,
          variables: data.variables,
          interventionType: data.variables[0].interventionType,
          reportMeasureId: data.variables[0].reportMeasureId,
          interventionValue: data.variables[0].interventionValue,
          measureType: data.variables[0].measureType,
          measureValue: data.variables[0].measureValue,
          variableRangeValue: data.variables[0].variableRangeValue,
          variableRangeData: data.variables[0].variableRangeData,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  reportNameChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getVariableRange(measureType) {
    let token = localStorage.getItem('token');
    let tokenId = localStorage.getItem('token_id');
    let _self = this;
    _self.setState({
      msg: _self.msg,
    });
    const obj = {
      measureType: measureType,
    };
    cancel1 && cancel1();
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }before-after-analysis/getVariableRange`,
        obj,
        {
          params: { session_token: token, user_id: tokenId },
          cancelToken: new cancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel1 = c;
          }),
        }
      )
      .then(res => {
        var variableRangeData = [];
        if (res.data.result.length > 0) {
          variableRangeData = res.data.result;
        }
        _self.setState({
          variableRangeData: variableRangeData,
          msg: _self.msgBlank,
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
  }

  searchChangeHandler = e => {
    if (this.state.showInterventionSearchResult == true) {
      let keyName = e.target.dataset.name;
      let keyCode = e.target.dataset.code;
      let interventionValue = '';
      if (keyCode != '') {
        interventionValue = keyName + '|' + keyCode;
      } else {
        interventionValue = keyName;
      }
      this.setState({
        interventionValue: interventionValue,
        showInterventionSearchResult: false,
      });
    } else if (this.state.showMeasureSearchResult == true) {
      let keyName = e.target.dataset.name;
      let keyCode = e.target.dataset.code;
      let measureValue = '';
      if (keyCode != '') {
        measureValue = keyName + '|' + keyCode;
      } else {
        measureValue = keyName;
      }
      this.setState({
        measureValue: measureValue,
        showMeasureSearchResult: false,
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    var _self = this;
    _self.setState({
      msg: _self.msgUpdate,
    });
    if (_self.validator.allValid()) {
      let token = localStorage.getItem('token');
      let tokenId = localStorage.getItem('token_id');
      let payload = {
        reportId: _self.state.reportId,
        reportName: _self.state.reportName,
        variables: [],
      };

      // eslint-disable-next-line array-callback-return
      _self.state.variables.map((value, index) => {
        payload.variables.push({
          reportMeasureId: _self.state.reportMeasureId,
          interventionType: _self.state.interventionType,
          interventionValue: _self.state.interventionValue,
          measureType: _self.state.measureType,
          measureValue: _self.state.measureValue,
          variableRangeValue: _self.state.variableRangeValue,
        });
      });
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }before-after-analysis/patientBeforeAfterUpdate/` +
            _self.props.match.params.id,
          payload,
          {
            params: {
              session_token: token,
              user_id: tokenId,
            },
          }
        )
        .then(res => {
          alert('Intervention updated successfully');
          _self.props.history.push(`/before-after-analysis`);
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

  handleInterventionTypeChange = e => {
    e.preventDefault();
    var interventionType = e.target.value;
    this.setState({
      interventionType: interventionType,
      interventionValue: '',
      interventionValueData: [],
    });
  };

  handleMeasureTypeChange = e => {
    e.preventDefault();
    var measureType = e.target.value;
    if (measureType == 1 || measureType == 3) {
      this.getVariableRange(measureType);
      this.setState({
        measureType: measureType,
        measureValue: '',
        showMeasureRange: true,
        measureValueData: [],
      });
    } else {
      this.setState({
        measureType: measureType,
        measureValue: '',
        showMeasureRange: false,
        measureValueData: [],
      });
    }
  };

  handleVariableRangeValueChange = e => {
    e.preventDefault();
    var variableRangeValue = e.target.value;
    this.setState({
      variableRangeValue: variableRangeValue,
    });
  };

  interventionValueChange = e => {
    e.preventDefault();
    let _self = this;
    _self.setState({
      msg: _self.msg,
      interventionValueData: [],
    });
    var searchText = e.target.value;
    _self.setState({ [e.target.name]: searchText });
    if (searchText.length > searchMinLength) {
      var interventionType = _self.state.interventionType;
      var apiUrl = helpers.getSearchApiUrl(
        process.env.REACT_APP_API_BASE_URL,
        interventionType
      );
      if (apiUrl !== '') {
        cancel && cancel();
        axios
          .get(apiUrl, {
            params: {
              search: searchText,
              interventionType: interventionType,
            },
            cancelToken: new cancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
            }),
          })
          .then(response => {
            // handle success
            _self.setState({
              showInterventionSearchResult: true,
              msg: _self.msgBlank,
              interventionValueData: response.data.result.data,
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
          msg: _self.msgBlank,
        });
      }
    } else {
      _self.setState({
        msg: _self.msgBlank,
        interventionValueData: [],
      });
    }
  };

  measureValueChange = e => {
    e.preventDefault();
    let _self = this;
    _self.setState({
      msg: _self.msg,
      measureValueData: [],
    });
    var searchText = e.target.value;
    _self.setState({ [e.target.name]: searchText });
    searchMinLength = _self.state.measureType == 5 ? 0 : 2;
    if (searchText.length > searchMinLength) {
      var measureType = _self.state.measureType;
      var apiUrl = helpers.getSearchApiUrl(
        process.env.REACT_APP_API_BASE_URL,
        measureType
      );
      if (apiUrl !== '') {
        cancel && cancel();
        axios
          .get(apiUrl, {
            params: {
              search: searchText,
              measureType: measureType,
            },
            cancelToken: new cancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
            }),
          })
          .then(response => {
            // handle success
            _self.setState({
              showMeasureSearchResult: true,
              msg: _self.msgBlank,
              measureValueData: response.data.result.data,
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
          msg: _self.msgBlank,
        });
      }
    } else {
      _self.setState({
        msg: _self.msgBlank,
        measureValueData: [],
      });
    }
  };

  render() {
    return (
      <MDBContainer className="mt-5">
        <MDBRow className="my-5">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Edit Intervention Before / After Analysis
                <MDBNavLink
                  class="btn btn-info float-right btn-sm"
                  to="/before-after-analysis"
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </MDBNavLink>
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
                          Name of Report
                        </label>
                        <input
                          value={this.state.reportName}
                          name="reportName"
                          onChange={this.reportNameChange}
                          type="text"
                          className={`form-control ${
                            this.state.screeningNameErr ? 'is-invalid' : ''
                          }`}
                        />
                        <div className="text-danger">
                          {this.validator.message(
                            'Name of Report',
                            this.state.reportName,
                            'required'
                          )}
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
                          <i class="fas fa-save fa-fw" /> Update
                        </MDBBtn>
                        <input
                          value={this.state.reportId}
                          name="reportId"
                          type="hidden"
                          className={`form-control`}
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol tag="h5">Intervention Measures:</MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="4" className="mb-4">
                        <label htmlFor="interventionType" className="grey-text">
                          Intervention Type
                        </label>
                        <select
                          name="interventionType"
                          className={`form-control`}
                          value={this.state.interventionType}
                          onChange={this.handleInterventionTypeChange}
                        >
                          <option value="">Select Intervention Type</option>
                          <option value="3">Medication </option>
                          <option value="7">Procedure</option>
                        </select>
                        <div className="text-danger">
                          {this.validator.message(
                            'interventionType',
                            this.state.interventionType,
                            'required'
                          )}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="interventionValue"
                          className="grey-text"
                        >
                          Intervention
                        </label>
                        <input
                          value={this.state.interventionValue}
                          name="interventionValue"
                          onChange={this.interventionValueChange}
                          type="text"
                          className={`form-control`}
                          autoComplete="off"
                        />
                        {this.state.showInterventionSearchResult ? (
                          <Suggestions
                            results={this.state.interventionValueData}
                            onChangehandler={this.searchChangeHandler}
                          />
                        ) : null}
                        <div className="text-danger">
                          {this.validator.message(
                            'interventionValue',
                            this.state.interventionValue,
                            'required'
                          )}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="4">
                        <label htmlFor="measureType" className="grey-text">
                          Measure before and after intervention
                        </label>
                        <select
                          name="measureType"
                          className={`form-control`}
                          value={this.state.measureType}
                          onChange={this.handleMeasureTypeChange}
                        >
                          <option value="">Select Measure Type</option>
                          <option value="1">Labs</option>
                          <option value="3">Medication</option>
                          <option value="5">Admission</option>
                        </select>
                        <div className="text-danger">
                          {this.validator.message(
                            'measureType',
                            this.state.measureType,
                            'required'
                          )}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label htmlFor="measureValue" className="grey-text">
                          Measure
                        </label>
                        <input
                          value={this.state.measureValue}
                          name="measureValue"
                          onChange={this.measureValueChange}
                          type="text"
                          className={`form-control`}
                          autoComplete="off"
                        />
                        {this.state.showMeasureSearchResult ? (
                          <Suggestions
                            results={this.state.measureValueData}
                            onChangehandler={this.searchChangeHandler}
                          />
                        ) : null}
                        <div className="text-danger">
                          {this.validator.message(
                            'measureValue',
                            this.state.measureValue,
                            'required'
                          )}
                        </div>
                      </MDBCol>
                      <MDBCol
                        md="4"
                        className={
                          this.state.measureType === '5' ? ' invisible' : ''
                        }
                      >
                        <label
                          htmlFor="variableRangeValue"
                          className="grey-text"
                        >
                          Output Value
                        </label>
                        <select
                          name="variableRangeValue"
                          className={`form-control`}
                          value={this.state.variableRangeValue}
                          onChange={this.handleVariableRangeValueChange}
                        >
                          <option value="">Select Variable values</option>
                          {this.state.variableRangeData.map((val, idx) => (
                            <option value={val.parameter_id}>
                              {val.parameter_name}
                            </option>
                          ))}
                        </select>
                        <div className="text-danger">
                          {this.validator.message(
                            'variableRangeValue',
                            this.state.variableRangeValue,
                            this.state.measureType == '1' ||
                              this.state.measureType == '3'
                              ? 'required'
                              : ''
                          )}
                        </div>
                      </MDBCol>
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

export default EditBeforeAfterAnalysis;
