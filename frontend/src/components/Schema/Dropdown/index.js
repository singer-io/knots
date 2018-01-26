import React from 'react';
import PropTypes from 'prop-types';

const Dropdown = (props) => (
  <select>
    {props.columns.map((column) => (
      <option key={column} value={column}>
        {column}
      </option>
    ))}
  </select>
);

Dropdown.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Dropdown;
