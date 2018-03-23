import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import './ConnectForm.css';

class ConnectForm extends Component {
  constructor(props) {
    super();

    this.state = {
      fields: props.prefillData
    };

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

  handleChange(idx) {
    return (evt) => {
      const { key } = this.props.fields[evt.target.name];
      const newFields = this.state.fields.map((field, sidx) => {
        if (idx !== sidx) return field;
        return { ...field, value: evt.target.value };
      });
      this.setState({ [key]: evt.target.value, fields: newFields });
      this.props.handleChange(key, evt.target.value, evt.target.name);
    };
  }

  render() {
    return (
      <form>
        {this.state.fields.map((field, index) => (
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
                type={field.key === 'password' ? 'password' : 'text'}
                value={field.value}
                onChange={this.handleChange(index)}
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
  handleChange: PropTypes.func.isRequired,
  prefillData: PropTypes.object.isRequired
};

export default inject('tapsStore')(observer(ConnectForm));
