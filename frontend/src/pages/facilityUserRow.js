import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

class FacilityRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.state = {
      alert: null,
    };
  }
  delete() {
    const getAlert = () => (
      <SweetAlert
        warning
        showCancel
        cancelBtnText="Cancel"
        confirmBtnText="Delete"
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="info"
        title="Are you sure?"
        onConfirm={() => this.deleteFacilityUser()}
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

  deleteFacilityUser() {
    let _self = this;
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }facilityUsers/FacilityUserDelete/` + this.props.obj.m_facility_user_id
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
    return (
      <tr>
        <td>{this.props.obj.m_facility_user_name}</td>
        <td>{this.props.obj.f_facility_id}</td>
        <td>{this.props.obj.m_facility_epicuser_id}</td>
        <td>
          <Link
            to={
              '/facilityuseredit/' +
              this.props.obj.f_facility_id +
              '/' +
              this.props.obj.m_facility_user_id
            }
            className=""
          >
            <MDBIcon icon="edit" size="lg" className="indigo-text" />{' '}
          </Link>{' '}
          <a href onClick={this.delete}>
            <MDBIcon icon="trash-alt" size="lg" className="red-text" />
          </a>
        </td>
        {this.state.alert}
      </tr>
    );
  }
}

export default FacilityRow;
