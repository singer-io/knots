// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../Header';
import Loader from '../Loader';
import KnotProgress from '../../containers/KnotProgress';
import ConnectForm from './ConnectForm';

type Props = {
  tapsStore: {
    schema: Array<{}>,
    tapsLoading: boolean,
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
    const { tapsLoading, schema } = this.props.tapsStore;
    if (schema.length > 0) {
      return <Redirect push to="/schema" />;
    }
    return (
      <div>
        <Header />
        {tapsLoading && <Loader />}
        {!tapsLoading && <KnotProgress />}
        {!tapsLoading && (
          <ConnectForm
            fields={this.props.tapsStore.tapFields}
            handleChange={this.handleChange}
            submit={this.submit}
          />
        )}
      </div>
    );
  }
}
