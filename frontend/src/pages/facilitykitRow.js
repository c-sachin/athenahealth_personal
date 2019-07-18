import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import helpers from '../components/helper';

class FacilitykitRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }
  delete() {
    let _self = this;
    if (window.confirm('Are you sure,you want to delete?')) {
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL
          }facilityKit/FacilityKitAccessDelete/` +
            _self.props.obj.facility_kit_access_id
        )
        .then(window.location.reload())
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
    }
  }
  render() {
    return (
      <tr>
        <td>{this.props.obj.facility_kit_server}</td>
        <td>{this.props.obj.facility_kit_userid}</td>
        <td>{this.props.obj.facility_fhir_secret}</td>
        <td>
          <Link
            to={'/editkitAcess/' + this.props.obj.facility_kit_access_id}
            className=""
          >
            <MDBIcon icon="edit" size="lg" className="indigo-text" />{' '}
          </Link>{' '}
          <a href onClick={this.delete} className="">
            <MDBIcon icon="trash-alt" size="lg" className="red-text" />
          </a>
        </td>
      </tr>
    );
  }
}

export default FacilitykitRow;
