// @flow
import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  InputGroupAddon,
  InputGroup
} from 'reactstrap';
import { ipcRenderer } from 'electron';

type Props = {
  fields: Array<{
    key: string,
    label: string,
    validationText: string,
    required: boolean,
    placeholder: string,
    options?: Array<string>,
    type?: string
  }>,
  fieldValues: {
    password?: string,
    client_id?: string,
    client_secret?: string,
    refresh_token?: string,
    api_type?: string,
    select_fields_by_default?: boolean
  },
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void,
  setSfRefreshToken: (token: string) => void
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
  constructor() {
    super();

    ipcRenderer.on('sf-oauth-reply', (event, token) => {
      this.props.setSfRefreshToken(token.refresh_token);
    });
  }

  authorize = (clientId?: string, clientSecret?: string) => {
    const authorizationCredentials = { clientId, clientSecret };
    ipcRenderer.send('sf-oauth', authorizationCredentials);
  };

  onGetRefreshToken = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const clientId = this.props.fieldValues.client_id;
    const clientSecret = this.props.fieldValues.client_secret;
    this.authorize(clientId, clientSecret);
  };

  render() {
    return (
      <Form>
        {this.props.fields.map((field) => (
          <FormGroup key={field.key}>
            <Label for={field.label}>{field.label}</Label>
            <InputGroup>
              {field.type === 'select' ? (
                <Input
                  readOnly={field.key === 'refresh_token'}
                  type={field.type}
                  name={field.key}
                  value={this.props.fieldValues[field.key]}
                  id={field.label}
                  onChange={this.props.handleChange}
                  invalid={!valid(field, this.props.fieldValues)}
                  valid={valid(field, this.props.fieldValues)}
                  placeholder={field.required ? '' : field.placeholder}
                >
                  <option value="" />
                  {field.options.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </Input>
              ) : (
                <Input
                  readOnly={
                    field.key === 'refresh_token' ||
                    field.key === 'api_type' ||
                    field.key === 'select_fields_by_default'
                  }
                  type={field.type}
                  name={field.key}
                  value={this.props.fieldValues[field.key]}
                  id={field.label}
                  onChange={this.props.handleChange}
                  invalid={!valid(field, this.props.fieldValues)}
                  valid={valid(field, this.props.fieldValues)}
                  placeholder={field.required ? '' : field.placeholder}
                />
              )}
              {field.key === 'refresh_token' && (
                <InputGroupAddon addonType="append">
                  <Button
                    disabled={
                      !(
                        this.props.fieldValues.client_id &&
                        this.props.fieldValues.client_secret
                      ) || this.props.fieldValues.refresh_token
                    }
                    outline
                    color="secondary"
                    onClick={(e) => {
                      this.onGetRefreshToken(e);
                    }}
                  >
                    Get token
                  </Button>
                </InputGroupAddon>
              )}
              <FormFeedback>{field.validationText}</FormFeedback>
            </InputGroup>
          </FormGroup>
        ))}
      </Form>
    );
  }
}
