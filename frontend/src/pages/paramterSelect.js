import React, { Component } from 'react';
import axios from 'axios';

class ParamterSelect extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }
  delete() {
    if (window.confirm('Are you sure,you want to delete?')) {
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}facilities/FacilityDelete/` +
            this.props.obj.m_facility_id
        )
        .then(window.location.reload())
        .catch(err => console.log(err));
    }
  }
  render() {
    return (
      <option value=" {this.props.obj.parameter_id}">
        {this.props.obj.parameter_name}
      </option>
    );
  }
}

export default ParamterSelect;
