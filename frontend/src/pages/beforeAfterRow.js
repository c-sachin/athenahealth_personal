/* eslint-disable no-script-url */
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import helpers from '../components/helper';
class BeforeAfterRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
      paramData: [],
      countParam: {},
      render: false,
    };
    this.delete = this.delete.bind(this);
  }
  delete() {
    const getAlert = () => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="delete"
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="info"
        title="Are you sure?"
        onConfirm={() => this.deleteBaa()}
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

  deleteBaa() {
    var _self = this;
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }before-after-analysis/beforeAfterDelete/` + _self.props.obj.baa_id
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
        <td>{this.props.obj.baa_name}</td>
        <td>{this.props.obj.paramCount}</td>
        <td>
          {this.props.obj.baa_created_timestamp
            ? moment(this.props.obj.baa_created_timestamp).format('MM-DD-YYYY')
            : '--'}
        </td>
        <td>
          <Link
            to={'/edit-before-after-analysis/' + this.props.obj.baa_id}
            className=""
          >
            <MDBIcon icon="edit" size="lg" className="indigo-text" />{' '}
          </Link>

          <a href="Javascript:Void(0)" onClick={this.delete} className="">
            <MDBIcon icon="trash-alt" size="lg" className="red-text" />
          </a>
        </td>
        {this.state.alert}
      </tr>
    );
  }
}

export default BeforeAfterRow;
