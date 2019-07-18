import React from 'react';
import {
  MDBEdgeHeader,
  MDBFreeBird,
  MDBCol,
  MDBRow,
  MDBCardBody,
} from 'mdbreact';
import './homePage.css';

class Unauthorized extends React.Component {
  render() {
    return (
      <div>
        <MDBEdgeHeader color="indigo darken-3" />
        <MDBFreeBird>
          <MDBRow>
            <MDBCol
              md="10"
              className="mx-auto float-none white z-depth-1 py-2 px-2"
            >
              <MDBCardBody>
                <h2 className="h2-responsive mb-4">
                  <strong>AGORA Healthcare</strong>
                </h2>
                <p />
                <p className="pb-4">
                  You are unauthorized to access this application
                </p>
                <MDBRow className="d-flex flex-row justify-content-center row" />
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBFreeBird>
      </div>
    );
  }
}

export default Unauthorized;
