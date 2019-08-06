/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBFormInline,
  MDBIcon,
  MDBBtn,
} from 'mdbreact';
import { Link } from 'react-router-dom';
import axios from 'axios';
import helpers from '../components/helper';
import DataTable from 'react-data-table-component';
import { DatatableNoData } from '../components/datatableComponent';
import {CSVLink} from 'react-csv';
import './table.css';
let facilityId = '';

const cancelToken = axios.CancelToken;
var cancel; // Cancel token for get list

class FacilityAppointmentPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.id;
    this.state = {
      records: [],
      csvData:[],
      recordsCount: 0,
      datatableMsg: 'No data found for appointments.',
      msg: [{ msgLoading: '', msgError: '' }],
      loading: false,
      perPage: 50,
      searchText: '',
      enableSearch: false,
      /**
       * Current page in datatable pagination. default is 1.
       */
      currentPage: 1,
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
    this.handleClearSearch = this.handleClearSearch.bind(this);

    /**
     * Columns for Datatable
     */
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

    /**
     * Configuration used for Datatable
     */
    this.config = helpers.getDatatableConfig('appointment_id', 'asc');
  }

  /**
   * Reuseable function to get list
   *
   * @param {number} page Page number
   * @param {number} perPage Rows per page
   * @param {string} searchText Search text
   */
  async getList(
    page = 1,
    perPage = this.state.perPage,
    searchText = '',
    paginationReset
  ) {
    let _self = this;
    const obj = {
      facility_id: facilityId,
    };
    _self.setState({
      msg: _self.msg,
      loading: true,
    });
    var apiUrl = 'facilityAppointments';
    var postData = {
      page,
      per_page: perPage,
    };
    if (searchText != '') {
      apiUrl = 'search';
      postData = {
        search: searchText,
        page,
        per_page: perPage
      };
    }
    cancel && cancel();
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}facilityAppointments/${apiUrl}`, obj, {
        params: postData,
        cancelToken: new cancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then(res => {
        if (paginationReset) {
          helpers.resetDatatablePagination();
        }
        _self.setState({
          loading: false,
          records: res.data.result.data,
          recordsCount: res.data.result.count,
          msg: _self.msgBlank,
          currentPage: page,
          perPage,
        });
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log('axios request cancelled.');
        } else {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            loading: false,
            msg: msgErr,
          });
        }
      });
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

 async getAllAppointments(searchText){
  const obj = {
    facility_id: facilityId,
  };
  axios
    .post(
      `${process.env.REACT_APP_API_BASE_URL}facilityAppointments/facilityAppointmentsAll`,
      obj,
      {params: {
        search: searchText
      }}
    )
    .then(res => {
      this.setState({
        csvData: res.data.result
      });
    })
    .catch(err => {
      let msgErr = helpers.errMessage(err);
      this.setState({
        msg: msgErr,
      });
    });
 }

  /**
   * Get initial list on component mount
   * @param {number} page Current page. Default is 1
   */
  async componentDidMount(page = 1) {
    this.getAllAppointments('');
    let _self = this;
    const { perPage } = _self.state;
    await _self.getList(page, perPage, _self.state.searchText);
  }

  /**
   * Handler for page change event
   */
  handlePageChange = async page => {
    let _self = this;
    const { perPage } = _self.state;
    await _self.getList(page, perPage, _self.state.searchText);
  };

  /**
   * Handler rows for page change event
   */
  handlePerRowsChange = async (perPage, page) => {
    let _self = this;
    await _self.getList(page, perPage, _self.state.searchText, true);
  };

  /**
   * Handler for search field change event
   */
  handleSearchTextChange = async e => {
    this.getAllAppointments(e.target.value);
    let _self = this;
    var searchText = e.target.value;
    _self.setState({
      msg: _self.msgBlank,
      searchText: searchText,
    });
    if (searchText.length >= 3) {
      _self.setState({
        enableSearch: true,
      });
      var perPage = _self.state.perPage;
      var page = 1;
      var paginationReset = true;
      await _self.getList(page, perPage, searchText, paginationReset);
    }
  };

  /**
   * Handler for search field clear button event
   */
  handleClearSearch() {
    this.setState({ searchText: '' });
    if (this.state.enableSearch == true) {
      window.location.reload();
    }
  }

  render() {
    const {
      striped,
      highlightOnHover,
      responsive,
      noHeader,
      className,
      customTheme,
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
                <CSVLink class="btn btn-info float-right btn-sm" data={this.state.csvData} >Export To CSV</CSVLink>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol size="12" sm="6" lg="8" className="text-left">
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
                  {this.state.recordsCount > 0 ? (
                    <MDBCol size="6" lg="4">
                      <MDBFormInline className="md-form mt-0 mb-0">
                        <MDBIcon icon="search" />
                        <input
                          className="form-control form-control-sm ml-3 w-75"
                          type="text"
                          name="searchText"
                          placeholder="Search For:"
                          aria-label="Search For:"
                          value={this.state.searchText}
                          onChange={this.handleSearchTextChange}
                          autoComplete="false"
                        />
                        {this.state.enableSearch == true ? (
                          <MDBIcon
                            icon="undo-alt"
                            className="text-danger cursor-pointer fa-fw"
                            onClick={this.handleClearSearch}
                            title="Click to reset search filter if applied."
                          />
                        ) : (
                          ''
                        )}
                      </MDBFormInline>
                      {this.state.enableSearch == true ? (
                        <p className="text-success help-block">
                          <small>
                            <i className="fa fa-info-circle fa-fw" /> Search
                            filter applied.
                          </small>
                        </p>
                      ) : (
                        ''
                      )}
                    </MDBCol>
                  ) : (
                    ''
                  )}
                </MDBRow>
                <DataTable
                  noHeader={noHeader}
                  columns={this.columns}
                  data={this.state.records}
                  striped={striped}
                  highlightOnHover={highlightOnHover}
                  responsive={responsive}
                  noDataComponents={
                    <DatatableNoData
                      msg={this.state.datatableMsg}
                      columns={this.columns}
                    />
                  }
                  pagination
                  paginationServer
                  paginationTotalRows={this.state.recordsCount}
                  onChangeRowsPerPage={this.handlePerRowsChange}
                  onChangePage={this.handlePageChange}
                  paginationPerPage={this.state.perPage}
                  paginationRowsPerPageOptions={[1, 10, 15, 20, 25, 30, 50, 100]}
                  className={className}
                  style={customTheme}
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