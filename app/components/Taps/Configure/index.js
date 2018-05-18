// @flow
import React, { Component } from 'react';

import ConnectForm from './ConfigureForm';

type Props = {
  fields: Array<{
    key: string,
    label: string,
    validationText: string,
    required: boolean,
    options: Array<string>,
    placeholder: string,
    type?: string
  }>,
  fieldValues: {
    password?: string,
    client_id?: string,
    password?: string,
    client_id?: string,
    client_secret?: string,
    refresh_token?: string,
    api_type?: string,
    select_fields_by_default?: boolean
  },
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void,
  submit: () => void,
  setSfRefreshToken: (token: string) => void
};

export default class Configure extends Component<Props> {
  render() {
    return (
      <div>
        <ConnectForm
          fields={this.props.fields}
          fieldValues={this.props.fieldValues}
          handleChange={this.props.handleChange}
          submit={this.props.submit}
          setSfRefreshToken={this.props.setSfRefreshToken}
        />
      </div>
    );
  }
}
