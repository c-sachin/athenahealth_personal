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
import RaceRow from './raceRow';
import Cookies from 'js-cookie';
import helpers from '../components/helper';

class RaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      msg: [{ msgLoading: '', msgError: '' }],
    };
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgBlank = helpers.setMsg('', '');
  }
  componentDidMount() {
    let _self = this;
    _self.userId = localStorage.getItem('user_id');
    var token = Cookies.get('token');
    var tokenId = Cookies.get('token_id');
    _self.setState({
      msg: _self.msg,
    });
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}race/raceList`, {
        params: {
          session_token: token,
          user_id: tokenId,
        },
      })
      .then(res => {
        const data = res.data.result;
        _self.setState({
          data,
          msg: _self.msgBlank,
        });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  raceRow() {
    return this.state.data.map(function(object, i) {
      return <RaceRow obj={object} key={i} />;
    });
  }

  render() {
    if (
      typeof Cookies.get('token_id') === 'undefined' ||
      typeof Cookies.get('token') === 'undefined' ||
      typeof Cookies.get('utype') === 'undefined'
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
                Race List
                <Link
                  className="btn btn-primary float-right btn-sm"
                  to="/race-add"
                >
                  <i class="fas fa-plus-circle fa-fw" /> Create Race
                </Link>
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
                )}
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
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>{this.raceRow()}</MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default RaceList;
