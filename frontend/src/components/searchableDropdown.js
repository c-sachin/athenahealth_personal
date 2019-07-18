/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class SearchableDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      disableOptions: false,
      data: [],
    };
    if (props.options.data.length !== this.state.data.length) {
      this.state = {
        selected: props.options.selected,
        disableOptions: props.options.selected === '' ? false : true,
        data: props.options.data,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options.data.length !== this.state.data.length) {
      this.setState({
        selected:
          nextProps.options.selected !== '' ? nextProps.options.selected : '',
        disableOptions: nextProps.options.selected !== '' ? true : false,
        data: nextProps.options.data,
      });
    }
  }

  handleFilter = option => {
    const selected = option.parameter_name;
    this.setState({ selected: selected, disableOptions: true });

    let obj = {
      target: {
        value: option.parameter_name,
        dataset: {
          name: this.props.options.dataset.name,
          id: this.props.options.dataset.id.toString(),
        },
      },
    };
    this.props.onUpdate(obj);
  };

  handleInputChange = e => {
    this.setState({ selected: e.target.value, disableOptions: false });
  };
  onClearValue = e => {
    this.setState({ selected: '', disableOptions: false });
  };

  render() {
    let filteredData = this.state.data.filter(record => {
      return (
        record.parameter_name
          .toLowerCase()
          .indexOf(this.state.selected.toLowerCase()) !== -1
      );
    });
    return (
      <React.Fragment>
        <input
          className="form-control"
          type="text"
          value={this.state.selected}
          style={{ width: '158  px' }}
          placeholder="Search"
          onFocus={e => {
            this.onClearValue(e);
          }}
          onChange={this.handleInputChange.bind(this)}
        />
        <div
          className="dropdown-menu border-0 dropdown-primary"
          style={
            this.state.disableOptions
              ? {
                  display: 'none',
                  top: 'auto',
                  padding: 'initial',
                  margin: '0px 0px 0px 15px',
                }
              : {
                  display: 'block',
                  top: 'auto',
                  padding: 'initial',
                  margin: '0px 0px 0px 15px',
                }
          }
        >
          {filteredData.map(option => (
            <a
              className="dropdown-item mdb-dropdownLink-1"
              onClick={() => this.handleFilter(option)}
              href="javascript:void(0)"
            >
              {option.parameter_name}
            </a>
          ))}
        </div>
        {/* <MDBIcon  onClick={(e) => { this.onClearValue(e) }} icon="window-close" size="lg" className="indigo-text"/> */}
      </React.Fragment>
    );
  }
}

export default SearchableDropdown;
