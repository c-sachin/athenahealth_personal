import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon, MDBBtn } from 'mdbreact';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';
const paddingStyle = {
  padding: '4px'
};

class FacilityAppointmentRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
    };
   this.getFeedback = this.getFeedback.bind(this);
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


  render() {
      if(this.props.obj.appointment_survey_send_status == 1){
        var status = 'Not Send';
      }else if(this.props.obj.appointment_survey_send_status == 2){
        var status = 'Successfully Sent';
      }else{
        var status = 'Failed';
      }

      var statusText = '';
      if(this.props.obj.appointment_feedback_status == 3){
          var statusText = <MDBBtn style={paddingStyle} className="btn btn-primary btn-sm" type="button" onClick={this.getFeedback.bind(this, this.props.obj.appointment_id)}>
                Not Received Try Again</MDBBtn>;
      }else if(this.props.obj.appointment_feedback_status == 2){
        var statusText = this.props.obj.appointment_feedback_response;
      }else if(this.props.obj.appointment_survey_send_status == 2){
        var statusText = <MDBBtn style={paddingStyle} className="btn btn-primary btn-sm" type="button" onClick={this.getFeedback.bind(this, this.props.obj.appointment_id)}>
                Get Feedback</MDBBtn>;
      }
    return (
      <tr>
        <td>{this.props.obj.patient_fname+' '+this.props.obj.patient_lname}</td>
        <td>{this.props.obj.patient_mobileno}</td>
        <td>{this.props.obj.patient_email}</td>
        <td>{this.props.obj.appointment_date}</td>
        <td>{status}</td>
        <td>{statusText}</td>
      </tr>
    );
  }
}

export default FacilityAppointmentRow;
