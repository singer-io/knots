// @flow

import React, { Component } from 'react';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';

export default class Schema extends Component<{}> {
  render() {
    return (
      <div>
        <Header />
        <KnotProgress />Schema
      </div>
    );
  }
}
