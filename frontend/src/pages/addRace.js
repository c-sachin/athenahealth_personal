import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './reportcheckbox';
import {
  MDBCardHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBBtn,
  MDBCardBody,
} from 'mdbreact';
import Cookies from 'js-cookie';

class AddRace extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (
      Cookies.get('token_id') === undefined ||
      Cookies.get('token') === undefined ||
      Cookies.get('utype') === undefined
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
                Add Race
                <Link
                  className="btn btn-info float-right btn-sm"
                  to={'/dailyquery'}
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol md="4">
                    <label
                      htmlFor="defaultFormRegisterNameEx"
                      className="grey-text"
                    >
                      Add Race
                    </label>
                    <input
                      name="raceName"
                      type="text"
                      className={`form-control`}
                    />
                    <br />
                    <MDBBtn
                      className="btn-md m-0"
                      color="primary"
                      type="submit"
                    >
                      <i class="fas fa-save fa-fw" /> Save
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default AddRace;
