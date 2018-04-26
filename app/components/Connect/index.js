// @flow

import React, { Component } from 'react';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';

export default class Taps extends Component<{}> {
  render() {
    return (
      <div>
        <Header />
        <KnotProgress />Hello
      </div>
    );
  }
}
