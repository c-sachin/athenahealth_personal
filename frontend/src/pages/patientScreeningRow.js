/* eslint-disable no-script-url */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { MDBCollapse, MDBIcon } from 'mdbreact';
import SweetAlert from 'react-bootstrap-sweetalert';
import PatientResultModal from './patientResultModal';
import helpers from '../components/helper';

const ul = {
  padding: '0',
};
class PatientScreeningRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
      paramData: [],
      msg: [{ msgLoading: '', msgError: '' }],
      countParam: {},
      render: false,
      showCollapse: false,
    };
    this.runquery = this.runquery.bind(this);
    this.delete = this.delete.bind(this);
  }
  state = {
    collapseID: 'collapse3',
  };
  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      showCollapse: !this.state.showCollapse,
      collapseID: prevState.collapseID !== collapseID ? collapseID : '',
    }));
  };

  displayParam(collapseID) {
    let _self = this;
    if (!_self.state.showCollapse) {
      let obj = {};
      if (collapseID) {
        obj = {
          id: collapseID,
        };
      }
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}parameterlist`, obj)
        .then(result => {
          _self.setState({ paramData: result.data.result.data });
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
    } else {
      _self.setState({ paramData: [] });
    }
  }

  runquery() {
    let _self = this;
    if (window.confirm('Are you sure want to run this query?')) {
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}patientSearch/runQuery/` +
            this.props.obj.psq_id
        )
        .then(response => {
          alert('Query has been executed sucessfully.');
          window.location.reload();
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          alert(err.response.data.error);
          _self.setState({
            msg: msgErr,
          });
        });
    }
  }

  displayData() {
    return this.state.paramData.map(function(object, i) {
      return (
        <ul type="none" style={ul}>
          <li>
            <b>Criteria Name:</b> {object.psqc_criterion_name}
          </li>
          <li>
            <b>Criteria :</b>
            {object.psqc_criterion_text}
          </li>
          <li>
            <b>{object.psqc_criterion_condition}</b>
          </li>
          <hr />
        </ul>
      );
    });
  }
  delete() {
    const getAlert = () => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="delete"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="primary"
        title="Are you sure want to delete this?"
        onConfirm={() => this.deletePatientScreeing()}
        onCancel={() => this.hideAlert()}
      />
    );
    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert() {
    this.setState({
      alert: null,
    });
  }
  deletePatientScreeing() {
    let _self = this;
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }patientSearch/patientScreeningDelete/` + this.props.obj.psq_id
      )
      .then(window.location.reload())
      .catch(err => {
        let msgErr = helpers.errMessage(err);

        _self.setState({
          msg: msgErr,
        });
      });
  }

  render() {
    let { collapseID } = this.state;
    var parameterTxt = '';
    if (this.props.obj.paramCount > 1) {
      parameterTxt = 'Parameters';
    } else {
      parameterTxt = 'Parameter';
    }
    return (
      <tr>
        <td>{this.props.obj.m_facility_user_name}</td>
        <td>{this.props.obj.psq_name}</td>

        <td width="400">
          <Link
            to="#"
            onClick={this.displayParam.bind(this, this.props.obj.psq_id)}
          >
            <Link
              to="#"
              onClick={this.toggleCollapse(this.props.obj.psq_id)}
              title="ASD"
            >
              {this.props.obj.paramCount} {parameterTxt}
              &nbsp;&nbsp; <i className="fa fa-angle-down 2x" />
              <MDBCollapse id={this.props.obj.psq_id} isOpen={collapseID}>
                <br />
                {this.displayData()}
              </MDBCollapse>
            </Link>
          </Link>
        </td>
        <td>
          <PatientResultModal
            size="lg"
            id={this.props.obj.psq_id}
            patients={this.props.obj.solar_query_reponse_patients_cnt}
          />
        </td>

        <td>
          {this.props.obj.psq_created_timestamp
            ? moment(this.props.obj.psq_created_timestamp).format('MM-DD-YYYY ')
            : '--'}
        </td>
        <td>
          {this.props.obj.query_run_updated_at
            ? moment(this.props.obj.query_run_updated_at).format(
                'MM-DD-YYYY hh:mm'
              )
            : '--'}
        </td>
        <td>
          <Link
            to={'/patientScreeningEdit/' + this.props.obj.psq_id}
            title="Click to Edit"
            className=""
          >
            <MDBIcon icon="edit" size="lg" className="indigo-text" />
          </Link>
          &emsp;
          <a
            title="Click to Run"
            onClick={this.runquery}
            className=""
            href="Javascript:Void(0)"
          >
            <MDBIcon icon="sync" size="lg" className="red-text" />
          </a>
          &emsp;
          <a
            href="Javascript:Void(0)"
            onClick={this.delete}
            className=""
            title="Click to Delete"
          >
            <MDBIcon icon="trash-alt" size="lg" className="red-text" />
          </a>
        </td>
        {this.state.alert}
      </tr>
    );
  }
}

export default PatientScreeningRow;
