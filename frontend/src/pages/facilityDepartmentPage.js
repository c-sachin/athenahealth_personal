import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCardHeader,
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import axios from 'axios';
import FacilityDepartmentRow from './facilityDepartmentRow';
import Cookies from 'js-cookie';
import helpers from '../components/helper';
let facilityId = '';
class FacilityDepartmentPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.id;
    this.state = {
      data: [],
      msg: [{ msgLoading: '', msgError: '' }],
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgUpdate = helpers.setMsg('Updating data...', '');
  }
  componentDidMount() {
    const obj = {
      facility_id: facilityId,
    };
    this.setState({
      msg: this.msg,
    });
    let _self = this;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityDepartments/FacilityDepartments`,
        obj
      )
      .then(res => {
        const data = res.data.result;
        this.setState({ data, msg: this.msgBlank });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }
  facilityDepartmentRow() {
      return this.state.data.map(function(object, i) {
      return <FacilityDepartmentRow obj={object} key={i} />;
    });
  }

   fatchDepartments = () => {
    const obj = {
      facility_id: facilityId,
    };
    this.setState({
      msg: this.msg,
    });
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityDepartments/FatchDepartments`,
          obj
      )
      .then(res => {
        this.setState({ msg: this.msgBlank });
        window.location.reload()
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        console.log(msgErr);
        this.setState({
          msg: msgErr,
        });
      });
  }

  render() {
    // Check if cookies available
    if (
      Cookies.get('token_id') === 'undefined' ||
      Cookies.get('token') === 'undefined' ||
      Cookies.get('utype') === 'undefined' ||
      Cookies.get('utype') !== '0'
    ) {
      this.props.history.push(`/`);
      window.location.reload();
    }
    return (
      <MDBContainer className="mt-3">
        <MDBRow className="py-3">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Departments
                <Link
                  className="btn btn-info float-right btn-sm"
                  to={'/FacilityPage'}
                >
                  <i className="fas fa-undo fa-fw" /> Back
                </Link>
                <MDBBtn
                      className="btn btn-primary float-right btn-sm"
                      type="button"
                      onClick={this.fatchDepartments}
                    >
                      Fetch Departments
                </MDBBtn>
              </MDBCardHeader>
              <MDBCardBody>
                {this.state.msg[0].msgLoading !== '' ? (
                  <p className="text-center">
                    {' '}
                    {this.state.msg[0].msgLoading}{' '}
                    <i className="fa fa-spinner fa-pulse fa-fw" />
                  </p>
                ) : (
                  ''
                )}{' '}
                {this.state.msg[0].msgError !== '' ? (
                  <p className="text-center text-danger">
                    <i className="fa fa-exclamation-triangle fa-fw" />{' '}
                    {this.state.msg[0].msgError}{' '}
                  </p>
                ) : (
                  ''
                )}
                <MDBTable>
                  <MDBTableHead>
                    <tr>
                      <th>EHR Department ID</th>
                      <th>Department Name</th>
                      <th>Department City</th>
                      <th>Campaign ID</th>
                      <th>Status</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>{this.facilityDepartmentRow()}</MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default FacilityDepartmentPage;
