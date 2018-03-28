import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';

class Checkbox extends Component {
  constructor(props) {
    super();

    this.state = { checked: props.checked };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { checked } = this.state;
    this.props.handleChange('selected', this.props.index, checked);
  }

  toggle() {
    const checked = !this.state.checked;
    this.props.handleChange('selected', this.props.index, checked);
    this.setState({ checked });
  }

  render() {
    return (
      // eslint-disable-next-line
      <div className="checkbox" onClick={this.toggle}>
        {this.state.checked && <i className="fa fa-check" aria-hidden="true" />}
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
