import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';

class Checkbox extends Component {
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.handleChange('selected', this.props.index, !this.props.checked);
  }

  render() {
    return (
      // eslint-disable-next-line

      <div className="checkbox" onClick={this.toggle}>
        {this.props.checked && <i className="fa fa-check" aria-hidden="true" />}
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired
};

Checkbox.defaultProps = {
  checked: false
};

export default Checkbox;
