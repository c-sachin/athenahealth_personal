import React from 'react';
import {
  MDBEdgeHeader,
  MDBFreeBird,
  MDBCol,
  MDBRow,
  MDBCardBody,
} from 'mdbreact';
import './homePage.css';

class Welcome extends React.Component {
  componentDidMount() {}
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
                <h2 className="h2-responsive mb-4 text-center">
                  <strong>AGORA Healthcare</strong>
                </h2>
                <p className="pb-4 text-center">
                  <i className="fas fa-info-circle fa-fw" /> This application
                  shows patient screenings
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

export default Welcome;
