/* eslint-disable */
import React, { Component } from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import styles from './ConnectForm.css';

export default class ConnectForm extends Component<Props, State> {
  constructor() {
    super();
    this.state = {};

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getValidationState(key: string, required: boolean) {
    if (required) {
      const fieldValue = this.state[key];

      if (fieldValue) {
        return fieldValue.length > 0 ? 'success' : 'error';
      }

      return 'error';
    }

    return 'success';
  }

  handleChange(e: SyntheticKeyboardEvent) {
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
              <ControlLabel className={styles.controlLabel}>
                {field.label}
                <span className={styles.normal}>
                  {field.required ? '' : ' (optional)'}
                </span>
              </ControlLabel>
              <FormControl
                name={index}
                type={field.key === 'password' ? 'password' : 'text'}
                value={field.value || ''}
                onChange={this.handleChange}
              />
            </div>
          </FormGroup>
        ))}
      </form>
    );
  }
}
