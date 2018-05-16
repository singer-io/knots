// @flow
import React, { Component } from 'react';

import ConnectForm from './ConfigureForm';

type Props = {
  fields: Array<{
    key: string,
    label: string,
    validationText: string,
    required: boolean,
    placeholder: string
  }>,
  fieldValues: { password?: string, client_id?: string },
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void,
  submit: () => void,
  setSfRefreshToken: (token: string) => void
};

export default class Taps extends Component<Props> {
  render() {
    console.log('The props', this.props);
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
