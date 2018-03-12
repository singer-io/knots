import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.props.handleChange('replication_key', this.props.index, value);
  }

  render() {
    return (
      <select onChange={this.handleChange}>
        {this.props.columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
    );
  }
}

Dropdown.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default Dropdown;
