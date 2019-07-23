import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

class FacilityAppointmentRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
    };
  }
  render() {
    if(this.props.obj.appointment_survey_send_status == 1){
        var status = 'Not Send';
      }else if(this.props.obj.appointment_survey_send_status == 2){
        var status = 'Successfully Sent';
      }else{
        var status = 'Failed';
      }
    return (
      <tr>
        <td>{this.props.obj.patient_fname+' '+this.props.obj.patient_lname}</td>
        <td>{this.props.obj.patient_mobileno}</td>
        <td>{this.props.obj.patient_email}</td>
        <td>{this.props.obj.appointment_date}</td>
        <td>{status}</td>
      </tr>
    );
  }
}

export default FacilityAppointmentRow;
