import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

class FacilityRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
    };
  }
  render() {
    return (
      <tr>
        <td>{this.props.obj.patient_fname+' '+this.props.obj.patient_lname}</td>
        <td>{this.props.obj.patient_mobileno}</td>
        <td>{this.props.obj.patient_email}</td>
      </tr>
    );
  }
}

export default FacilityRow;
