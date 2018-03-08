import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import './ConnectForm.css';

class ConnectForm extends Component {
  constructor() {
    super();

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  getValidationState(key, required) {
    if (required) {
      const fieldValue = this.state[key];

      if (fieldValue) {
        return fieldValue.length > 0 ? 'success' : 'error';
      }

      return 'error';
    }

    return 'success';
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { key } = this.props.fields[name];
    this.setState({ [key]: value });

    this.props.handleChange(key, value, name);
  }

  render() {
    return (
      <form>
        {this.props.fields.map((field, index) => (
          <FormGroup
            controlId="formBasicText"
            key={field.key}
            validationState={this.getValidationState(field.key, field.required)}
          >
            <div key={field.key}>
              <ControlLabel className="control-label">
                {field.label}
                <span className="normal">
                  {field.required ? '' : ' (optional)'}
                </span>
              </ControlLabel>
              <FormControl
                name={index}
                type="text"
                onChange={this.handleChange}
              />
            </div>
          </FormGroup>
        ))}
      </form>
    );
  }
}

ConnectForm.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  fields: PropTypes.object.isRequired, // fields is a mobx array
  handleChange: PropTypes.func.isRequired
};

export default inject('tapsStore')(observer(ConnectForm));
