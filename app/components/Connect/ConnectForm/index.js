/* eslint-disable */
import React, { Component } from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import styles from './ConnectForm.css';

export default class ConnectForm extends Component<Props, State> {
  constructor(props) {
    super();
    this.state = {
      fields: props.fields
    };

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.state.fields.map((field, index) => {
      const { key, value } = field;
      if (value) {
        this.setState({ [key]: value });
        this.props.handleChange(key, value, index.toString());
      }
    });
  }

  getValidationState(key: string, required: boolean) {
    if (required) {
      const fieldValue = this.props.fieldValues[key];

      if (fieldValue) {
        return fieldValue.length > 0 ? 'success' : 'error';
      }

      return 'error';
    }

    return 'success';
  }

  handleChange(idx) {
    return (evt: SyntheticKeyboardEvent) => {
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
              <ControlLabel className={styles.controlLabel}>
                {field.label}
                <span className={styles.normal}>
                  {field.required ? '' : ' (optional)'}
                </span>
              </ControlLabel>
              <FormControl
                name={index}
                type={field.key === 'password' ? 'password' : 'text'}
                value={this.props.fieldValues[field.key] || ''}
                onChange={this.handleChange(index)}
              />
            </div>
          </FormGroup>
        ))}
      </form>
    );
  }
}
