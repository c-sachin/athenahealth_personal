import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import {CSVLink, CSVDownload} from 'react-csv';
import {
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from 'mdbreact';
import axios from 'axios';
import helpers from '../components/helper';
import Cookies from 'js-cookie';
import './table.css';
let facilityId = '';
// const csvData =[
//   ['firstname', 'lastname', 'email'] ,
//   ['John', 'Doe' , 'john.doe@xyz.com'] ,
//   ['Jane', 'Doe' , 'jane.doe@xyz.com']
// ];
class FacilityAppointmentPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.id;
    this.state = {
      records: [],
      csvData:[],
      recordsCount: 0,
      msg: [{ msgLoading: '', msgError: '' }],
      loading: false,
      perPage: 1,
      alert: null,
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
    this.getFeedback = this.getFeedback.bind(this);

    this.config = {
      sort: { column: 'appointment_id', order: 'asc' },
      striped: true,
      highlightOnHover: true,
      responsive: true,
      noDataComponent: true,
      noHeader: 'false',
    };

    this.columns = [
      {
        selector: 'patient_fname',
        name: 'Patient Name',
        className: 'patient_fname',
        align: 'left',
        sortable: true,
        width: 30,
        cell: record => {
          return record.patient_fname+' '+record.patient_lname;
        },
      },
      {
        selector: 'patient_mobileno',
        name: "Mobile Number",
        className: 'patient_mobileno',
        align: 'left',
        sortable: true,
        width: 30,
      },
      {
        selector: 'patient_email',
        name: 'Email ID',
        className: 'patient_email',
        align: 'left',
        sortable: true,
        width: 30,
      },
      {
        selector: 'appointment_date',
        name: 'Appointment Date',
        className: 'appointment_date',
        align: 'left',
        sortable: true,
        width: 30,
      },
      {
        name: 'Survey Send Status',
        className: 'status',
        align: 'left',
        sortable: true,
        width: 30,
        cell: record => {
          var status = '';
          if(record.appointment_survey_send_status == 1){
            status = 'Not Send';
          }else if(record.appointment_survey_send_status == 2){
            status = 'Successfully Sent';
          }else{
            status = 'Failed';
          }
          return status
        },
      },
      {
        name: 'Survey Feedback',
        className: 'action',
        width: 50,
        align: 'left',
        sortable: false,
        ignoreRowClick: true,
        cell: record => {
          var statusText = '';
          if(record.appointment_feedback_status == 3) {
            statusText = <MDBBtn className="btn btn-primary btn-sm" type="button" onClick={this.getFeedback.bind(this, record.appointment_id)}> Not Received Try Again</MDBBtn>;
          } else if(record.appointment_feedback_status == 2) {
            statusText = record.appointment_feedback_response;
          } else if(record.appointment_survey_send_status == 2) {
            statusText = <MDBBtn className="btn btn-primary btn-sm" type="button" onClick={this.getFeedback.bind(this, record.appointment_id)}> Get Feedback</MDBBtn>;
          }
          return statusText
        },
      },
    ];
  }

  getFeedback(appointment_id,e){
    //e.preventDefault();
   const obj = {
     appointment_id: appointment_id
   };
   let _self = this;
   axios
     .post(
       `${process.env.REACT_APP_API_BASE_URL}facilityAppointments/feedback/`,
         obj
     )
     .then(res => {
       window.location.reload()
     })
     .catch(err => {
       let msgErr = helpers.errMessage(err);
       console.log(msgErr);
       _self.setState({
         msg: msgErr,
       });
     });
 }

  async componentDidMount() {
    let _self = this;
    const obj = {
      facility_id: facilityId,
    };
    _self.setState({
      msg: _self.msg,
      loading: true,
    });
    const { perPage } = _self.state;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityAppointments/facilityAppointments`,
        obj,
        {params: {
          page: 1,
          per_page: perPage,
        }}
      )
      .then(res => {
        _self.setState({
          loading: false,
          records: res.data.result.data,
          csvData: res.data.result.data,
          recordsCount: res.data.result.count,
          msg: _self.msgBlank,
        });
        console.log(res.data.result.data)
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  hideAlert() {
    this.setState({
      alert: null,
    });
  }

  handlePageChange = async page => {
    let _self = this;
    _self.setState({
      msg: _self.msg,
      loading: true,
    });
    const obj = {
      facility_id: facilityId,
    };

    const { perPage } = _self.state;

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityAppointments/facilityAppointments`,
        obj,
        {params: {
          page,
          per_page: perPage,
        }}
      )
      .then(res => {
        _self.setState({
          loading: false,
          records: res.data.result.data,
          csvData: res.data.result.data,
          recordsCount: res.data.result.count,
          msg: _self.msgBlank,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  };

  handlePerRowsChange = async (perPage, page) => {
    let _self = this;
    _self.setState({
      msg: _self.msg,
      loading: true,
      perPage,
    });
    const obj = {
      facility_id: facilityId,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityAppointments/facilityAppointments`,
        obj,
        {params: {
          page,
          per_page: perPage,
        }}
      )
      .then(res => {
        _self.setState({
          loading: false,
          records: res.data.result.data,
          csvData: res.data.result.data,
          recordsCount: res.data.result.count,
          msg: _self.msgBlank,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
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

    const {
      striped,
      highlightOnHover,
      responsive,
      noDataComponent,
      noHeader,
    } = this.config; 
    return (
      <MDBContainer className="mt-3">
        <MDBRow className="py-3">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Appointments Details
                <Link
                  class="btn btn-info float-right btn-sm"
                  to={'/FacilityPage'}>
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>

                <CSVLink class="btn btn-info float-right btn-sm" data={this.state.csvData} >Download me</CSVLink>
                
              </MDBCardHeader>
              <MDBCardBody>
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
                {this.state.alert}
                <DataTable
                  columns={this.columns}
                  data={this.state.records}
                  striped={striped}
                  highlightOnHover={highlightOnHover}
                  responsive={responsive}
                  noDataComponent={noDataComponent}
                  pagination
                  paginationServer
                  paginationTotalRows={this.state.recordsCount}
                  onChangeRowsPerPage={this.handlePerRowsChange}
                  onChangePage={this.handlePageChange}
                  paginationPerPage={this.state.perPage}
                  paginationRowsPerPageOptions={[1, 10, 15, 20, 25, 30, 50, 100]}
                  noHeader={noHeader}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
export default FacilityAppointmentPage;
