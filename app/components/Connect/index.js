// @flow

import React, { Component } from 'react';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import ConnectForm from './ConnectForm';

type Props = {
  tapsStore: {
    tapFields: Array<{
      key: string,
      label: string
    }>,
    fieldValues: {}
  },
  updateTapField: (key: string, value: string) => void,
  submitConfig: (fieldValues: {}) => void
};

export default class Taps extends Component<Props> {
  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = event.currentTarget;
    this.props.updateTapField(name, value);
  };

  submit = () => {
    this.props.submitConfig(this.props.tapsStore.fieldValues);
  };

  render() {
    return (
      <div>
        <Header />
        <KnotProgress />
        <ConnectForm
          fields={this.props.tapsStore.tapFields}
          handleChange={this.handleChange}
          submit={this.submit}
        />
      </div>
    );
  }
}
