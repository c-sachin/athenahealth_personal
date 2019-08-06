import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import axios from 'axios';
import FacilityUserRow from './facilityUserRow';
import Cookies from 'js-cookie';
import helpers from '../components/helper';
let facilityId = '';
class FacilityUserPage extends Component {
  constructor(props) {
    super(props);
    facilityId = this.props.match.params.id;
    this.state = {
      data: [],
      msg: [{ msgLoading: '', msgError: '' }],
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
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
        `${process.env.REACT_APP_API_BASE_URL}facilityUsers/FacilityUsers`,
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
  facilityUserRow() {
    return this.state.data.map(function(object, i) {
      return <FacilityUserRow obj={object} key={i} />;
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
                Appointments
                <Link
                  class="btn btn-info float-right btn-sm"
                  to={'/FacilityPage'}
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>
                {/* <Link
                  class="btn btn-primary float-right btn-sm"
                  to={'/facilityUserCreate/' + facilityId}
                >
                  <i class="fas fa-plus-circle fa-fw" /> Create Facility User
                </Link> */}
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
                      <th>Patient Name</th>
                      <th>Mobile Number</th>
                      <th>Email ID</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>{this.facilityUserRow()}</MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default FacilityUserPage;
