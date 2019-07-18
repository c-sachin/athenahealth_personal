import React, { Component } from 'react';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';

class RaceRow extends Component {
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
        onConfirm={() => this.deleteRace(this.props.obj.race_id)}
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

  deleteRace(raceId) {
    let _self = this;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}race/raceDelete/` + raceId)
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
        <td>{this.props.obj.race_name}</td>
        <td>
          <Link to={'/editRace/' + this.props.obj.race_id} className="">
            <MDBIcon icon="edit" size="lg" className="indigo-text ml-2" />
          </Link>

          <a href="javscript:void(0)" onClick={this.delete} className="">
            <MDBIcon icon="trash-alt" size="lg" className="red-text ml-2" />
          </a>
        </td>
        {this.state.alert}
      </tr>
    );
  }
}

export default RaceRow;
