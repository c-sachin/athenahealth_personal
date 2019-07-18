import React, { Component } from 'react';
import { MDBRow, MDBCol } from 'mdbreact';

import Suggestions from '../components/psqSuggestions';

class MembersRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let parameterConditionId = '';
    let parameterTableId = '';
    let parameterSubTableValuesId = '';
    let parameterSubTableDataValuesId = '';
    let parameterConditionValId = '';
    let idx = this.props.data.id;
    let val = this.props.data.value;
    let parameterTableValueId = `parameterTableValue-${idx}`;

    return (
      <div className="m-3">
        <div>
          {
            <React.Fragment>
              <MDBRow>
                <MDBCol md="4" className="mb-3">
                  <label
                    htmlFor="defaultFormRegisterNameEx"
                    className="grey-text"
                  >
                    {' '}
                    {`Parameter Name #${idx + 1}`}{' '}
                  </label>
                  <input
                    size="sm"
                    value={val.groupCriteriaName}
                    name="psqcCriterionName"
                    data-id={idx}
                    data-name="groupCriteriaName"
                    onChange={e => {
                      this.props.onChangehandler(e);
                    }}
                    type="text"
                    className={`form-control`}
                  />
                  <div
                    className={`Criteria_name_${idx}`}
                    style={{ color: 'red' }}
                  >
                    {' '}
                    {this.props.validator.message(
                      `Criteria_name_${idx}`,
                      val.groupCriteriaName,
                      'required'
                    )}{' '}
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="2" className="mb-2">
                  <select
                    onChange={e => {
                      this.props.onChangehandler(e);
                    }}
                    name={parameterConditionId}
                    type="text"
                    id={parameterConditionId}
                    data-id={this.props.data.id}
                    className={`form-control`}
                    placeholder="Facility ID"
                    required={true}
                    data-name="parameterCondition"
                    value={this.props.data.value.parameterCondition}
                  >
                    <option value="">Select Parameter</option>
                    <option value="is">is</option>
                    <option value="is not">is not</option>
                  </select>
                  <div className="" style={{ color: 'red' }}>
                    {' '}
                    {this.props.validator.message(
                      `Criteria_condition_${idx}`,
                      this.props.data.value.parameterCondition,
                      'required'
                    )}{' '}
                  </div>
                </MDBCol>
                <MDBCol md="2" className="mb-2">
                  <select
                    onChange={e => {
                      this.props.onParameterTypeChangeHandler(e);
                    }}
                    name={parameterTableId}
                    type="text"
                    data-id={this.props.data.id}
                    data-name="parameterTable"
                    id={parameterTableId}
                    className={`form-control`}
                    placeholder="Facility ID"
                    required={true}
                    value={this.props.data.value.parameterTable}
                  >
                    <option value="">Select Parameter</option>
                    <option value="1">Patient Demographics</option>
                    <option value="2">Ordered Tests/Procedures</option>
                    <option value="3">Ordered Results With range</option>
                    <option value="4">Conditions/Problems</option>
                    <option value="5">Medications</option>
                    <option value="7">
                      Free Text Tha can be searched in notes
                    </option>
                  </select>
                  <div className="" style={{ color: 'red' }}>
                    {' '}
                    {this.props.validator.message(
                      `Criteria_parameter_${idx}`,
                      this.props.data.value.parameterTable,
                      'required'
                    )}{' '}
                  </div>
                </MDBCol>
                <MDBCol
                  md="2"
                  className={
                    `mb-2  para3-` +
                    idx +
                    (this.props.data.value.parameterTable === '7'
                      ? ' invisible'
                      : '')
                  }
                >
                  <Suggestions
                    idx={idx}
                    parameterTableValueId={parameterTableValueId}
                    defaultValue=""
                    results={val.parameterTableValuesData}
                    onChangehandler={e => {
                      this.props.handleVariableValueSearch(e);
                    }}
                    onSelectHandler={e => {
                      this.props.onSearchValueChangehandler(e);
                    }}
                    onChange={e => {
                      this.props.onVariableSearchCHange(e);
                    }}
                    validator={this.props.validator}
                    reset={this.props.reset}
                    onReset={e => {
                      this.props.onReset();
                    }}
                  />
                  <div className="" style={{ color: 'red' }}>
                    {' '}
                    {this.props.validator.message(
                      `Variable_value_${idx}`,
                      val.parameterTableValue,
                      this.props.data.value.parameterTable === '7'
                        ? ''
                        : 'required'
                    )}{' '}
                  </div>
                </MDBCol>

                <MDBCol
                  md="2"
                  className={
                    'mb-2  para4-' +
                    idx +
                    (this.props.data.value.parameterTable === '1' ||
                    this.props.data.value.parameterTable === '3'
                      ? ''
                      : ' invisible')
                  }
                >
                  <select
                    onChange={e => {
                      this.props.onChangehandler(e);
                    }}
                    name={parameterSubTableValuesId}
                    type="text"
                    id={parameterSubTableValuesId}
                    data-id={idx}
                    data-name="parameterSubTableValues"
                    className={`form-control`}
                    placeholder="Facility ID"
                    required={true}
                    value={val.parameterSubTableValues}
                  >
                    <option value="">Select Parameter</option>
                    {this.props.data.value.parameterSubTableValuesData.map(
                      (val, idx) => (
                        <option value={val.parameter_name}>
                          {val.parameter_name}
                        </option>
                      )
                    )}
                  </select>
                  <div className="" style={{ color: 'red' }}>
                    {' '}
                    {this.props.validator.message(
                      `Variable_condition_${idx}`,
                      this.props.data.value.parameterSubTableValues,
                      this.props.data.value.parameterTable === '1' ||
                        this.props.data.value.parameterTable === '3'
                        ? 'required'
                        : ''
                    )}{' '}
                  </div>
                </MDBCol>
                <MDBCol
                  md="1"
                  className={
                    'mb-2 para_val-' +
                    idx +
                    (this.props.data.value.parameterTableValue === 'Age' ||
                    this.props.data.value.parameterTable === '7' ||
                    this.props.data.value.parameterTable === '3'
                      ? ''
                      : ' invisible')
                  }
                >
                  <input
                    size="sm"
                    value={val.parameterSubTableDataValues}
                    style={this.style}
                    name={parameterSubTableDataValuesId}
                    data-id={idx}
                    data-name="parameterSubTableDataValues"
                    onChange={e => {
                      this.props.onChangehandler(e);
                    }}
                    type="text"
                    id={parameterSubTableDataValuesId}
                    className={`form-control col-md-12`}
                  />
                  <div className="" style={{ color: 'red' }}>
                    {' '}
                    {this.props.validator.message(
                      `Variable_text_${idx}`,
                      val.parameterSubTableDataValues,
                      this.props.data.value.parameterTableValue === 'Age' ||
                        this.props.data.value.parameterTable === '7' ||
                        this.props.data.value.parameterTable === '3'
                        ? 'required'
                        : ' '
                    )}{' '}
                  </div>
                </MDBCol>
                <MDBCol md="2" className="mb-2">
                  <select
                    onChange={e => {
                      this.props.onChangehandler(e);
                    }}
                    name={parameterConditionValId}
                    type="text"
                    data-id={idx}
                    data-name="parameterConditionVal"
                    id={parameterConditionValId}
                    className={`form-control`}
                    placeholder="Facility ID"
                    required={true}
                    value={val.parameterConditionVal}
                  >
                    <option value="">Select Parameter</option>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                  <div className="" style={{ color: 'red' }}>
                    {}
                    {this.props.validator.message(
                      `Parameter_condition_${idx}`,
                      val.parameterConditionVal,
                      this.props.parametersLength > 1 &&
                        this.props.parametersLength - 1 !== idx
                        ? 'required'
                        : ''
                    )}{' '}
                  </div>
                </MDBCol>
              </MDBRow>
            </React.Fragment>
          }
        </div>
      </div>
    );
  }
}

export default MembersRow;
