import React, { Component } from 'react';
import {
  MDBContainer,
  MDBNavLink,
  MDBRow,
  MDBCardHeader,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import Cookies from 'js-cookie';
import SweetAlert from 'react-bootstrap-sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import helpers from '../components/helper';

class ImagingCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: [{ msgLoading: '', msgError: '' }],
      imagingName: '',
      procedureKey: '',
      procedureCode: '',
      codeSetType: '',
      token: '',
      tokenId: '',
      alert: null,
      disable: false,
    };
    this.validator = new SimpleReactValidator({
      default: 'This field is required.',
    });
    this.msgBlank = helpers.setMsg('', '');
    this.msg = helpers.setMsg('Fetching data...', '');
    this.msgUpdate = helpers.setMsg('Updating data...', '');
  }

  handleSubmit = async event => {
    event.preventDefault();
    let _self = this;
    const obj = {
      imagingName: this.state.imagingName,
      procedureKey: this.state.procedureKey,
      procedureCode: this.state.procedureCode,
      codeSetType: this.state.codeSetType,
    };
    if (_self.validator.allValid()) {
      var token = Cookies.get('token');
      var tokenId = Cookies.get('token_id');

      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}imaging/imagingCreate`,
          obj,
          {
            params: {
              sessionToken: token,
              userId: tokenId,
            },
          }
        )
        .then(res => {
          const title = 'Record inserted';
          const getAlert = () => (
            <SweetAlert success title={title} onConfirm={this.onConfirm} />
          );
          this.setState({
            alert: getAlert(),
          });
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
    } else {
      _self.setState({
        msg: _self.msgBlank,
      });
      _self.validator.showMessages();
      _self.forceUpdate();
    }
  };

  onConfirm() {
    window.location.href = '/imaging';
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {});
  };

  render() {
    if (
      typeof Cookies.get('token_id') == 'undefined' ||
      typeof Cookies.get('token') == 'undefined' ||
      typeof Cookies.get('utype') == 'undefined' ||
      Cookies.get('utype') !== '0'
    ) {
      this.props.history.push(`/`);
      window.location.reload();
    }
    return (
      <MDBContainer className="mt-5">
        <MDBRow className="my-5">
          <MDBCol md="12">
            <MDBCard>
              <MDBCardHeader color="" tag="h3">
                Create Imaging
                <MDBNavLink
                  className="btn btn-info float-right btn-sm"
                  to="/imaging"
                >
                  <i className="fas fa-undo fa-fw" /> Back
                </MDBNavLink>
              </MDBCardHeader>
              <MDBCardBody>
                <h2 className="h2-responsive pb-4"> </h2>
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
                <div>
                  <form
                    className="needs-validation"
                    onSubmit={this.handleSubmit}
                    noValidate
                  >
                    <MDBRow>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Imaging name{' '}
                        </label>
                        <input
                          value={this.state.imagingName}
                          name="imagingName"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control`}
                        />
                        <div className="text-danger">
                          {this.validator.message(
                            'imagingName',
                            this.state.imagingName,
                            'required'
                          )}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Procedure Key{' '}
                        </label>
                        <input
                          value={this.state.procedureKey}
                          name="procedureKey"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control`}
                        />
                        <div className="text-danger">
                          {this.validator.message(
                            'procedureKey',
                            this.state.procedureKey,
                            'required|numeric'
                          )}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Procedure Code{' '}
                        </label>
                        <input
                          value={this.state.procedureCode}
                          name="procedureCode"
                          onChange={this.changeHandler}
                          type="text"
                          id="defaultFormRegisterNameEx"
                          className={`form-control`}
                        />
                        <div className="text-danger">
                          {this.validator.message(
                            'procedureCode',
                            this.state.procedureCode,
                            'required|numeric'
                          )}
                        </div>
                      </MDBCol>
                      <MDBCol md="4" className="mb-3">
                        <label
                          htmlFor="defaultFormRegisterNameEx"
                          className="grey-text"
                        >
                          Code Set Type{' '}
                        </label>
                        <select
                          value={this.state.codeSetType}
                          name="codeSetType"
                          onChange={this.changeHandler}
                          id="defaultFormRegisterNameEx"
                          className={`form-control`}
                        >
                          <option value="">Select Option</option>
                          <option value="CPT">CPT</option>
                          <option value="HCPCS">HCPCS</option>
                        </select>
                        <div className="text-danger">
                          {this.validator.message(
                            'codeSetType',
                            this.state.codeSetType,
                            'required'
                          )}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBBtn
                      className="btn-md"
                      color="primary"
                      type="submit"
                      disabled={this.state.disable}
                    >
                      <i className="fas fa-save fa-fw" /> Add
                    </MDBBtn>
                  </form>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {this.state.alert}
      </MDBContainer>
    );
  }
}

export default ImagingCreate;
