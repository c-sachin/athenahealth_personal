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
import DailyQueryRow from './dailyQueryRow';
import Cookies from 'js-cookie';
import helpers from '../components/helper';

class DailyQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      data: [],
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
  }
  componentDidMount() {
    var _self = this;
    var token = localStorage.getItem('token');
    var tokenId = localStorage.getItem('token_id');
    _self.setState({
      msg: _self.msg,
    });
    axios
      .post(
        `${
          process.env.REACT_APP_API_BASE_URL
        }dailyquery/patientDailyQueryList/`,
        null,
        {
          params: {
            session_token: token,
            user_id: tokenId,
          },
        }
      )
      .then(res => {
        const data = res.data.result;
        _self.setState({ data, msg: _self.msgBlank });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  dailyQueryRow() {
    if (this.state.data.length > 0) {
      return this.state.data.map(function(object, i) {
        return <DailyQueryRow obj={object} key={i} />;
      });
    } else {
      return (
        <tr align="center">
          <td colSpan="5">No data</td>
        </tr>
      );
    }
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
                Patient Daily Query
                <Link
                  className="btn btn-primary float-right btn-sm"
                  to="/createdailyquery"
                >
                  <i className="fas fa-plus-circle fa-fw" /> Create Patient
                  Daily Query
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
                      <th>Author Name</th>
                      <th>Variable Name</th>
                      <th>Variables</th>
                      <th>Date Created</th>
                      <th>Action</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>{this.dailyQueryRow()}</MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default DailyQuery;
