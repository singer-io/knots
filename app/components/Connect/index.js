// @flow

import React, { Component } from 'react';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import ConnectForm from './ConnectForm';

type Props = {
  tapsStore: {
    tapFields: Array<{}>
  }
};

export default class Taps extends Component<Props> {
  render() {
    return (
      <div>
        <Header />
        <KnotProgress />
        <ConnectForm fields={this.props.tapsStore.tapFields} />
      </div>
    );
  }
}
