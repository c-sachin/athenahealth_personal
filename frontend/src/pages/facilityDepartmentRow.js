import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import helpers from '../components/helper';
    var status = '';

class FacilityRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      campaign_id:this.props.obj.facility_survey_campaign_id
    };
  }

  changeStatus(status,deptId,e) {
    if(this.state.campaign_id){
      e.preventDefault();
      const obj = {
        status: status,
        department_id: deptId
      };
      let _self = this;
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}facilityDepartments/updateStatus/`,
            obj
        )
        .then(res => {
            //console.log(res);
            window.location.reload()
        })
        .catch(err => {
          let msgErr = helpers.errMessage(err);
          _self.setState({
            msg: msgErr,
          });
        });
      }else{
        alert('Please enter compaign ID.');
      }
  }


  handleChange(deptId,event) {
    this.setState({campaign_id: event.target.value});
    var compaignId = event.target.value
    const obj = {
      department_id: deptId,
      compaign_id: compaignId
    };
    let _self = this;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}facilityDepartments/updateCompaignId/`,
          obj
      )
      .then(res => {

      })
      .catch(err => {
        let msgErr = helpers.errMessage(err);
        _self.setState({
          msg: msgErr,
        });
      });
  }

  render() {
    if(this.props.obj.department_is_deleted == 1){
       var statusFlag = 0;
       var statusText = 'Inactive';
    }else{
      var statusFlag = 1;
      var statusText = 'Active';
    }
    return (
      <tr>
        <td>{this.props.obj.departmentid}</td>
        <td>{this.props.obj.department_name}</td>
        <td>{this.props.obj.department_city}</td>
        <td><input type='text' className='form-control' value={this.state.campaign_id} onChange={(e) => this.handleChange(this.props.obj.department_id, e)}/></td>
        <td><a href="#" onClick={this.changeStatus.bind(this, statusFlag,this.props.obj.department_id)} className="blue-text">{statusText}</a></td>
      </tr>
    );
  }
}

export default FacilityRow;
