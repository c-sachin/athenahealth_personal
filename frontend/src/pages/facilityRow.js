import React, { Component } from 'react';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

class FacilityRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.state = {
      kitStatus: '',
      alert: null,
    };
  }
  delete() {
    const getAlert = () => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Delete"
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="info"
        title="Are you sure?"
        onConfirm={() => this.deleteFacility(this.props.obj.m_facility_id)}
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

  deleteFacility(facilitiyId) {
    let _self = this;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilities/FacilityDelete/` +
          facilitiyId
      )
      .then(window.location.reload())
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }
  checkFacility(facilityId, e) {
    e.preventDefault();
    let _self = this;
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}facilityKit/checkFacilityKit/` +
          facilityId
      )
      .then(res => {
        let redirectPath = res.data.message;
        window.location.href = redirectPath;
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
      <tr>
        <td>{this.props.obj.m_facility_nm}</td>
        <td>{this.props.obj.m_facility_app_id}</td>
        <td>{this.props.obj.m_facility_owner_nm}</td>
        <td>
          <Link to={'/edit/' + this.props.obj.m_facility_id} className="">
            <MDBIcon icon="edit" size="lg" className="indigo-text ml-2" />
          </Link>
          <a
            href="javscript:void(0)"
            onClick={this.checkFacility.bind(
              this,
              this.props.obj.m_facility_id
            )}
          >
            <MDBIcon icon="key" size="lg" className="green-text ml-2" />
          </a>
          {/* <Link to={'/facilityUser/' + this.props.obj.m_facility_id}>
            <MDBIcon icon="user-friends" size="lg" className="blue-text ml-2" />
          </Link> */}
          <a href="javscript:void(0)" onClick={this.delete} className="">
            <MDBIcon icon="trash-alt" size="lg" className="red-text ml-2" />
          </a>
        </td>
        {this.state.alert}
      </tr>
    );
  }
}

export default FacilityRow;
