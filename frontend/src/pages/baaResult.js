/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import ReactDatatable from 'react-datatable-ext';
import {
  MDBContainer,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBNavLink,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import 'react-tabs/style/react-tabs.css';
import helpers from '../components/helper';
import axios from 'axios';

class BaaResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      baaResult: [],
      interventionType: '',
      interventionValue: '',
      measureType: '',
      measureValue: '',
      measureFilter: '',
      beforeDataCount: 0,
      beforeData: [],
      afterDataCount: 0,
      afterData: [],
      patientMrn: '',
      patientName: '',
      tabIndex: 0,
    };
    this.config = {
      page_size: 25,
      length_menu: [5, 10, 20, 50, 100],
      show_length_menu: false,
      show_filter: false,
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
  }

  componentDidMount() {
    let _self = this;
    _self.setState({
      msg: _self.msg,
    });
    let token = localStorage.getItem('token');
    let token_id = localStorage.getItem('token_id');
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}before-after-analysis/patient/` +
          this.props.match.params.patient_id,
        null,
        { params: { session_token: token, user_id: token_id } }
      )
      .then(response => {
        if (response.data.result[0].analysis == true) {
          _self.setState({
            msg: _self.msgBlank,
            baaResult: response.data.result[0],
            patientMrn: response.data.result[0].patientMrn,
            patientName: response.data.result[0].patientName,
            interventionType: response.data.result[0].interventionType,
            interventionValue: response.data.result[0].interventionValue,
            measureType: response.data.result[0].measureType,
            measureValue: response.data.result[0].measureValue,
            measureFilter: response.data.result[0].measureFilter,
            beforeDataCount: response.data.result[0].beforeMeasureCount,
            beforeData: response.data.result[0].beforeMeasureData,
            afterDataCount: response.data.result[0].afterMeasureCount,
            afterData: response.data.result[0].afterMeasureData,
          });
        } else {
          let msgErr = helpers.setMsg('', response.data.message);
          _self.setState({
            msg: msgErr,
            baaError: response.data.error,
            patientMrn: response.data.result[0].patientMrn,
            patientName: response.data.result[0].patientName,
            interventionType: response.data.result[0].interventionType,
            interventionValue: response.data.result[0].interventionValue,
            measureType: response.data.result[0].measureType,
            measureValue: response.data.result[0].measureValue,
            measureFilter: response.data.result[0].measureFilter,
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

  render() {
    if (this.state.measureType === 'Medication') {
      this.columns = [
        {
          key: 'Medication_StartDate',
          text: 'Date',
          className: 'Medication_StartDate',
          align: 'center',
          sortable: true,
        },
        {
          key: 'Medication_MinimumDose',
          text: 'Dose / Value',
          className: 'Medication_MinimumDose',
          align: 'left',
          sortable: true,
        },
        {
          key: 'Medication_DoseUnit',
          text: 'Unit',
          className: 'Medication_DoseUnit',
          align: 'left',
          sortable: false,
        },
      ];
    } else if (this.state.measureType === 'Lab Component') {
      this.columns = [
        {
          key: 'Created_on',
          text: 'Created On',
          className: 'Created_on',
          align: 'center',
          sortable: true,
        },
        {
          key: 'Result_Numeric_Value',
          text: 'Value',
          className: 'Result_Numeric_Value',
          align: 'left',
          sortable: true,
        },
        {
          key: 'Result_Unit',
          text: 'Unit',
          className: 'Result_Unit',
          align: 'left',
          sortable: false,
        },
      ];
    } else if (this.state.measureType === 'Admission') {
      this.columns = [
        {
          key: 'AdmissionDate',
          text: 'Admission Date',
          className: 'AdmissionDate',
          align: 'center',
          sortable: true,
        },
        {
          key: 'Type',
          text: 'Type',
          className: 'Type',
          align: 'left',
          sortable: true,
        },
      ];
    } else {
      this.columns = [
        {
          key: 'Medication_StartDate',
          text: 'Date',
          className: 'Medication_StartDate',
          align: 'center',
          sortable: true,
        },
        {
          key: 'Medication_MinimumDose',
          text: 'Dose / Value',
          className: 'Medication_MinimumDose',
          align: 'left',
          sortable: true,
        },
        {
          key: 'Medication_DoseUnit',
          text: 'Unit',
          className: 'Medication_DoseUnit',
          align: 'left',
          sortable: false,
        },
      ];
    }

    return (
      <MDBContainer>
        <MDBRow className="py-3">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Before After Analysis for patient: #
                <strong>{this.state.patientMrn}</strong>
                <MDBNavLink
                  class="btn btn-info float-right btn-sm"
                  to="/PatientScreening"
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </MDBNavLink>
              </MDBCardHeader>
              <MDBCardBody>
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
                  <MDBCol md="6">
                    <p>
                      Patient Name: <strong>{this.state.patientName}</strong>
                    </p>
                    <p>
                      Intervention Type:{' '}
                      <strong>{this.state.interventionType}</strong>
                    </p>
                    <p>
                      Intervention Value: <br />
                      <strong>{this.state.interventionValue}</strong>
                    </p>
                  </MDBCol>
                  <MDBCol md="6">
                    <p>
                      Measure Type: <strong>{this.state.measureType}</strong>
                    </p>
                    <p>
                      Measure Value: <br />
                      <strong>{this.state.measureValue}</strong>
                    </p>
                    <p>
                      Output Value: <strong>{this.state.measureFilter}</strong>
                    </p>
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="6">
                    <h4>Before Analysis</h4>
                    <p>Total Rows: {this.state.beforeDataCount}</p>
                    <ReactDatatable
                      config={this.config}
                      records={this.state.beforeData}
                      columns={this.columns}
                    />
                  </MDBCol>

                  <MDBCol md="6">
                    <h4>After Analysis</h4>
                    <p>Total Rows: {this.state.afterDataCount}</p>
                    <ReactDatatable
                      config={this.config}
                      records={this.state.afterData}
                      columns={this.columns}
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default BaaResult;
