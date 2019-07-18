/* eslint-disable eqeqeq */
import React, { Component } from 'react';

class PsqSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.defaultValue,
      showOptions: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.results.length > 0) {
      this.setState({
        showOptions: true,
      });
    } else {
      this.setState({
        showOptions: false,
      });
    }
    if (
      nextProps.defaultValue != '' &&
      typeof nextProps.defaultValue != undefined
    ) {
      this.setState({
        selected: nextProps.defaultValue,
      });
    }
    if (
      nextProps.reset !== null &&
      parseInt(nextProps.reset) === parseInt(nextProps.idx)
    ) {
      this.setState({
        selected: '',
      });
      this.props.onReset();
    }
  }
  handleClick = e => {
    let keyName = e.target.dataset.name;
    let keyCode = e.target.dataset.code;
    let selected = '';
    if (keyCode != '') {
      selected = keyName + '|' + keyCode;
    } else {
      selected = keyName;
    }
    this.setState({ selected: selected });
    this.props.onSelectHandler(e);
  };
  handleChange = e => {
    this.setState({ selected: e.target.value });
    this.props.onChange(e);
  };
  render() {
    const options = this.props.results.map(r => (
      <li
        data-index={this.props.idx}
        key={r.medication_id}
        value={r.name}
        data-name={r.name}
        data-code={r.code}
        onClick={e => {
          this.handleClick(e);
        }}
        handleChange={e => {
          this.handleChange(e);
        }}
      >
        {r.code != '' ? `${r.name}|${r.code}` : `${r.name}`}
      </li>
    ));
    return (
      <React.Fragment>
        <input
          name="parameterTableValue"
          data-name={this.props.parameterTableValueId}
          data-value={this.state.selected}
          data-id={this.props.idx}
          onChange={e => {
            this.handleChange(e);
          }}
          type="text"
          className={`form-control`}
          autoComplete="off"
          placeholder="Search Variable"
          value={this.state.selected}
        />

        <ul
          className="search-suggestions"
          style={
            this.state.showOptions ? { display: 'block' } : { display: 'none' }
          }
        >
          {options}
        </ul>
      </React.Fragment>
    );
  }
}

export default PsqSuggestions;
