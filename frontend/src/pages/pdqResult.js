/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBCard,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from 'mdbreact';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import helpers from '../components/helper';
import axios from 'axios';
import moment from 'moment';

class PdqResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdqResult: [],
      tabIndex: 0,
      msg: [{ msgLoading: '', msgError: '' }],
      patientMrn: '',
      patientName: '',
    };
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
  }

  componentDidMount() {
    let _self = this;
    let token = localStorage.getItem('token');
    let tokenId = localStorage.getItem('token_id');
    _self.setState({
      msg: _self.msg,
    });
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}dailyquery/pdqSolrResult/` +
          _self.props.match.params.id,
        null,
        { params: { session_token: token, user_id: tokenId } }
      )
      .then(response => {
        let data = Object.entries(response.data.result[0]);
        if (data.length > 0) {
          _self.setState({
            pdqResult: data,
            msg: _self.msgBlank,
          });
        } else {
          let msgErr = helpers.setMsg('', 'No data found.');
          _self.setState({
            pdqResult: data,
            msg: msgErr,
          });
        }
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}dailyquery/pdqSolrResultMrn/` +
          _self.props.match.params.id,
        null,
        { params: { session_token: token, user_id: tokenId } }
      )
      .then(response => {
        let patientMrn = '';
        let patientName = '';
        var data = response.data.result;
        if (data.length > 0) {
          patientMrn = data[0].psq_result_mrn;
          patientName = data[0].patient_name;
        }
        _self.setState({ patientMrn });
        _self.setState({ patientName });
      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  render() {
    return (
      <MDBContainer>
        <MDBRow className="my-5">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Patient Daily Query Result #{this.state.patientMrn}{' '}
                <Link
                  class="btn btn-info float-right btn-sm"
                  to={'/PatientScreening'}
                >
                  <i class="fas fa-undo fa-fw" /> Back
                </Link>
              </MDBCardHeader>
              <MDBCol md="12">
                <p>
                  Patient Name: <strong>{this.state.patientName}</strong>
                </p>
              </MDBCol>
              <MDBCol md="12">
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
              </MDBCol>
              {this.state.pdqResult.length > 0 ? (
                <Tabs
                  className="m-3 "
                  selectedIndex={this.state.tabIndex}
                  onSelect={tabIndex => this.setState({ tabIndex })}
                >
                  <TabList>
                    {this.state.pdqResult.map((val, idx) => {
                      return <Tab key={idx}>{val[0]}</Tab>;
                    })}
                  </TabList>
                  {this.state.pdqResult.map((val, idx) => {
                    return (
                      <TabPanel key={idx}>
                        <MDBTable>
                          <MDBTableHead>
                            <tr>
                              <th>Date</th>
                              <th>Variable Name</th>
                              <th width="550">Value</th>
                            </tr>
                          </MDBTableHead>
                          <MDBTableBody>
                            {val[1].map((val, idx) => {
                              return (
                                <tr key={idx}>
                                  <td>
                                    {' '}
                                    <b> </b>{' '}
                                    {val.date
                                      ? moment(val.date).format('MM-DD-YYYY')
                                      : '--'}
                                  </td>
                                  <td> {val.variableOption}</td>
                                  <td>
                                    {' '}
                                    <b>
                                      {' '}
                                      {val.variableValue}
                                      {/* {(val.type != 4 ? 'Value' : 'Category')} */}
                                    </b>{' '}
                                    {val.qty}{' '}
                                  </td>

                                  <hr />
                                </tr>
                              );
                            })}
                          </MDBTableBody>
                        </MDBTable>
                      </TabPanel>
                    );
                  })}
                </Tabs>
              ) : (
                ''
              )}
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default PdqResult;
