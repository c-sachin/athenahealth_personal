/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import Suggestions from '../components/pdqSearchSuggestions';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class VariableRowEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let idx = this.props.data.id;
    let val = this.props.data.value;
    let variableTypeId = `variableType-${idx}`;
    let variableValueId = `variableValue-${idx}`;
    let variablePeriodId = `variablePeriod-${idx}`;
    let variableRangeValueId = `variableRangeValue-${idx}`;
    let variableDateId = `variableDate-${idx}`;

    return (
      <div className="m-3" key={idx}>
        {
          <React.Fragment>
            <MDBRow>
              <MDBCol md="2" className="mb-3">
                <select
                  name={variableTypeId}
                  className={`form-control`}
                  data-id={idx}
                  data-name="variableType"
                  id={idx}
                  onChange={e => {
                    this.props.onVariableTypeChangeHandler(e);
                  }}
                  value={val.variableType}
                >
                  <option value="">Select Variable Type</option>
                  <option value="1">Labs</option>
                  <option value="2">Vital Signs</option>
                  <option value="3">Medication given</option>
                  <option value="4">Imaging</option>
                  <option value="5">Admission Status</option>
                </select>
                <div className="" style={{ color: 'red' }}>
                  {' '}
                  {this.props.validator.message(
                    `Variable_type_${idx}`,
                    val.variableType,
                    'required'
                  )}{' '}
                </div>
              </MDBCol>
              <MDBCol md="2" className={`mb-3  para3-` + idx}>
                <Suggestions
                  idx={idx}
                  variableValueId={variableValueId}
                  results={val.variableValueData}
                  onChangehandler={e => {
                    this.props.handleVariableValueSearch(e);
                  }}
                  onSelectHandler={e => {
                    this.props.onSearchVariableValueChangehandler(e);
                  }}
                  onChange={e => {
                    this.props.onVariableSearchCHange(e);
                  }}
                  validator={this.props.validator}
                  defaultValue={val.variableValue}
                  reset={this.props.reset}
                  onReset={e => {
                    this.props.onReset();
                  }}
                />
                <div className="" style={{ color: 'red' }}>
                  {' '}
                  {this.props.validator.message(
                    `Variable_value_${idx}`,
                    val.variableValue,
                    'required'
                  )}{' '}
                </div>
              </MDBCol>
              <MDBCol
                md="2"
                className={
                  `mb-2  para3-` +
                  idx +
                  (val.variableType == '3' ? '' : ' invisible')
                }
              >
                <select
                  onChange={e => {
                    this.props.onChangehandler(e);
                  }}
                  type="text"
                  name={variablePeriodId}
                  data-id={idx}
                  data-name="variablePeriod"
                  id={idx}
                  className={`form-control`}
                  placeholder="Variable Type"
                  value={val.variablePeriod}
                >
                  <option value="">Select Variable period</option>
                  <option value="1">Daily</option>
                  <option value="2">Week</option>
                  <option value="3">Month</option>
                </select>
                <div className="" style={{ color: 'red' }}>
                  {' '}
                  {this.props.validator.message(
                    `Variable_period_${idx}`,
                    val.variablePeriod,
                    val.variableType == '3' ? 'required' : ''
                  )}{' '}
                </div>
              </MDBCol>

              <MDBCol
                md="2"
                className={
                  `mb-2  para2-` +
                  idx +
                  (val.variableType == '5' ? ' invisible' : '')
                }
              >
                <select
                  onChange={e => {
                    this.props.onChangehandler(e);
                  }}
                  name={variableRangeValueId}
                  type="text"
                  data-id={idx}
                  data-name="variableRangeValue"
                  id={idx}
                  className={`form-control`}
                  placeholder="variable Range Value"
                  value={val.variableRangeValue}
                >
                  <option value="">Select Variable values</option>
                  {this.props.data.value.variableRangeData.map((val, idx) => (
                    <option value={val.parameter_id}>
                      {val.parameter_name}
                    </option>
                  ))}
                </select>
                <div className="" style={{ color: 'red' }}>
                  {' '}
                  {this.props.validator.message(
                    `Variable_range_${idx}`,
                    val.variableRangeValue,
                    val.variableType == '5' ? '' : 'required'
                  )}{' '}
                </div>
              </MDBCol>
              <MDBCol
                md="2"
                className={
                  `mb-2  para3-` +
                  idx +
                  (val.variableType == '5' ? '' : ' invisible')
                }
              >
                {
                  <DatePicker
                    className="form-control"
                    options={{
                      name: variableDateId,
                      dataset: {
                        id: idx,
                        name: 'variableDate',
                      },
                    }}
                    selected={val.variableDate}
                    onChange={e => {
                      this.props.onDatepickerChangeHandler(
                        e,
                        idx,
                        'variableDate'
                      );
                    }}
                  />
                }
                <div className="" style={{ color: 'red' }}>
                  {' '}
                  {this.props.validator.message(
                    `Variable_date_${idx}`,
                    val.variableDate,
                    val.variableType == '5' ? 'required' : ''
                  )}{' '}
                </div>
              </MDBCol>
              <MDBCol
                md="1"
                className={`mb-2 ` + idx + (idx == '0' ? ' invisible' : ' ')}
              >
                <MDBIcon
                  data-id={idx}
                  onClick={e => {
                    this.props.onDelete(e);
                  }}
                  icon="window-close"
                  size="lg"
                  className="red-text"
                />
              </MDBCol>
            </MDBRow>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default VariableRowEdit;
