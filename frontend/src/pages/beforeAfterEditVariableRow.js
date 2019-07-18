import React, { Component } from 'react';
import { MDBRow, MDBCol } from 'mdbreact';
import SearchableDropdown from '../components/searchableDropdown';

class EditVariableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let idx = this.props.data.id;
    let val = this.props.data.value;
    let reportMeasureId = `reportMeasureId-${idx}`;
    let interventionTypeId = `interventionType-${idx}`;
    let interventionValueId = `interventionValue-${idx}`;
    let measureTypeId = `measureType-${idx}`;
    let measureValueId = `measureValue-${idx}`;
    let variableRangeValueId = `variableRangeValue-${idx}`;
    let variableRangeRequired = val.measureType === '5' ? '' : 'required';

    return (
      <div className="m-3" key={idx}>
        {
          <React.Fragment>
            <MDBRow>
              <MDBCol md="4" className="mb-4">
                <label htmlFor="interventionType" className="grey-text">
                  Intervention Type
                </label>
                <input
                  name={reportMeasureId}
                  data-id={idx}
                  data-name="reportMeasureId"
                  id={idx}
                  type="hidden"
                  className={`form-control`}
                  value={val.reportMeasureId}
                />
                <select
                  onChange={e => {
                    this.props.onChangehandler(e);
                  }}
                  name={interventionTypeId}
                  data-id={idx}
                  data-name="interventionType"
                  data-value={val.interventionType}
                  id={idx}
                  className={`form-control`}
                  value={val.interventionType}
                >
                  <option value="">Select Intervention Type</option>
                  <option value="3">Medication</option>
                  <option value="7">Procedure</option>
                </select>
                <div className="" style={{ color: 'red' }}>
                  {this.props.validator.message(
                    'Intervention Type',
                    val.interventionType,
                    'required'
                  )}
                </div>
              </MDBCol>
              <MDBCol md="4" className={`mb-4  para3-` + idx}>
                <label htmlFor="interventionValue" className="grey-text">
                  Intervention
                </label>
                <SearchableDropdown
                  options={{
                    name: interventionValueId,
                    data: val.interventionValueData,
                    selected: val.interventionValue,
                    id: { idx },
                    dataset: {
                      id: idx,
                      name: 'interventionValue',
                    },
                  }}
                  onUpdate={e => {
                    this.props.onChangehandler(e);
                  }}
                  placeholder="Variable Type"
                />
                <div className="" style={{ color: 'red' }}>
                  {this.props.validator.message(
                    'Intervention Value',
                    val.interventionType,
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
                  onChange={e => {
                    this.props.onChangehandler(e);
                  }}
                  name={measureTypeId}
                  data-id={idx}
                  data-name="measureType"
                  id={idx}
                  className={`form-control`}
                  value={val.measureType}
                >
                  <option value="">Select Measure Type</option>
                  <option value="1">Labs</option>
                  <option value="3">Medication</option>
                  <option value="5">Admission</option>
                </select>
                <div className="" style={{ color: 'red' }}>
                  {this.props.validator.message(
                    'Measure Type',
                    val.measureType,
                    'required'
                  )}
                </div>
              </MDBCol>
              <MDBCol md="4" className={`mb-4  para3-` + idx}>
                <label htmlFor="measureValue" className="grey-text">
                  Measure
                </label>
                <SearchableDropdown
                  options={{
                    name: measureValueId,
                    data: val.measureValueData,
                    selected: val.measureValue,
                    id: { idx },
                    dataset: {
                      id: idx,
                      name: 'measureValue',
                    },
                  }}
                  onUpdate={e => {
                    this.props.onChangehandler(e);
                  }}
                  placeholder="Variable Type"
                />
                <div className="" style={{ color: 'red' }}>
                  {this.props.validator.message(
                    'Measure Value',
                    val.measureValue,
                    'required'
                  )}
                </div>
              </MDBCol>
              <MDBCol
                md="4"
                className={
                  `mb-4  para2-` +
                  idx +
                  (val.measureType === '5' ? ' invisible' : '')
                }
              >
                <label htmlFor="variableRangeValue" className="grey-text">
                  Output Value
                </label>
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
                    'Value',
                    val.variableRangeValue,
                    variableRangeRequired
                  )}{' '}
                </div>
              </MDBCol>
            </MDBRow>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default EditVariableRow;
