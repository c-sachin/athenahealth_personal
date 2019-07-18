/* eslint-disable no-script-url */
import React, { Component, Fragment } from 'react';
import ReactDatatable from 'react-datatable-ext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import helpers from '../components/helper';
import {
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBCol,
} from 'mdbreact';
import './table.css';

class PatientResultModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      paramData: [],
      records: [],
      msg: [{ msgLoading: '', msgError: '' }],
    };
    this.columns = [
      {
        key: 'psq_result_mrn',
        text: 'Patient MRN',
        className: 'name',
        align: 'left',
        sortable: true,
      },
      {
        key: 'psq_result_name',
        text: 'Patient Name',
        className: 'address',
        align: 'left',
        sortable: true,
      },
      {
        key: 'psq_result_ag',
        text: 'Patient Age',
        className: 'postcode',
        sortable: true,
      },
      {
        key: 'psq_result_sex',
        text: 'Patient Gender',
        className: 'rating',
        align: 'left',
        sortable: true,
      },
      {
        key: 'psq_result_marital_status',
        text: 'Marital Status',
        className: 'type_of_food',
        sortable: true,
        align: 'left',
      },
      {
        key: 'psq_result_race',
        text: 'Patient Race',
        className: 'type_of_food',
        sortable: true,
        align: 'left',
      },
      {
        key: 'psq_result_id',
        text: 'Action',
        className: 'action sortable',
        width: 125,
        align: 'middle',
        sortable: false,
        cell: record => {
          return (
            <Fragment>
              <Link to={'/Pdqresult/' + record.psq_result_id} className="">
                <i title="Daily Query" className="far fa-clock fa-fw" />
              </Link>
              &emsp;
              <Link
                to={'/before-after-analysis/patient/' + record.psq_result_id}
                className=""
              >
                <i
                  title="Before After Analysis"
                  className="fas fa-chart-line fa-fw"
                />
              </Link>
              &emsp;
              <Link
                onClick={this.redirectAddChart.bind(
                  this,
                  record.psq_result_mrn
                )}
                to="javascript:void(0)"
              >
                <i title="Chart Review" className="fas fa-chart-bar fa-fw" />
              </Link>
            </Fragment>
          );
        },
      },
    ];
    this.config = {
      page_size: 10,
      length_menu: [1],
      show_length_menu: false,
    };
  }

  redirectAddChart(mrn, e) {
    e.preventDefault();
    window.location.href = '/add-chart-review/' + mrn;
  }
  toggle = event => {
    if (!this.state.modal) {
      // Fetch patient list
      this.getPatientList();
    }
    this.setState({
      modal: !this.state.modal,
    });
  };

  getPatientList() {
    let _self = this;
    var token = localStorage.getItem('token');
    var token_id = localStorage.getItem('token_id');
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}patientSearch/patientResult/` +
          this.props.id,
        null,
        {
          params: {
            session_token: token,
            user_id: token_id,
          },
        }
      )
      .then(res => {
        const records = res.data.result['rows'];
        //console.log(records);
        this.setState({ records });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  render() {
    return (
      <MDBContainer>
        <a
          href="Javascript:void(0)"
          onClick={this.toggle}
          title="Click to view patient list for this search query."
        >
          {this.props.patients}
        </a>
        <MDBModal isOpen={this.state.modal} toggle={this.toggle} size="lg">
          <MDBModalHeader toggle={this.toggle}>Patients</MDBModalHeader>
          <MDBModalBody>
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
              <ReactDatatable
                config={this.config}
                records={this.state.records}
                columns={this.columns}
              />
            </div>
          </MDBModalBody>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default PatientResultModal;
