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
import FacilitykitRow from './facilitykitRow';
import Cookies from 'js-cookie';
import helpers from '../components/helper';

class FacilityKitListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    let _self = this;
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}facilityKit/FacilityKitAccess`,
        {
          params: {
            session_token: token,
            user_id: tokenId,
          },
        }
      )
      .then(res => {
        const data = res.data;
        this.setState({ data });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
          disable: true,
        });
      });
  }
  facilitykitRow() {
    return this.state.data.map(function(object, i) {
      return <FacilitykitRow obj={object} key={i} />;
    });
  }

  render() {
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
                Facility Kit Access
                <Link
                  class="btn btn-primary float-right btn-sm"
                  to="/FacilitykitAcessPage"
                >
                  Create Facility Kit Access
                </Link>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBTable>
                  <MDBTableHead>
                    <tr>
                      <th>Facility Kit Server Name</th>
                      <th>Facility User Id</th>
                      <th>Facility FHIR secret</th>
                      <th>Action</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>{this.facilitykitRow()}</MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default FacilityKitListPage;
