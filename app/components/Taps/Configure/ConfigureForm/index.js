// @flow
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

type Props = {
  fields: Array<{
    key: string,
    label: string,
    validationText: string,
    required: boolean,
    placeholder: string
  }>,
  fieldValues: { password?: string },
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void
};

const valid = (field, fieldValues) => {
  if (field.required) {
    if (!fieldValues[field.key]) {
      return false;
    }
  }

  return true;
};

export default class ConnectForm extends Component<Props> {
  render() {
    return (
      <Form>
        {this.props.fields.map((field) => (
          <FormGroup key={field.key}>
            <Label for={field.label}>{field.label}</Label>
            <Input
              type={field.key === 'password' ? 'password' : 'string'}
              name={field.key}
              value={this.props.fieldValues[field.key]}
              id={field.label}
              onChange={this.props.handleChange}
              invalid={!valid(field, this.props.fieldValues)}
              valid={valid(field, this.props.fieldValues)}
              placeholder={field.required ? '' : field.placeholder}
            />
            <FormFeedback>{field.validationText}</FormFeedback>
          </FormGroup>
        ))}
      </Form>
    );
  }
}
