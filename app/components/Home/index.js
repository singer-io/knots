// @flow
import React, { Component } from 'react';
import Create from './Create';
import Header from '../Header';

type Props = {
  knotsStore: {
    knots: Array<String>
  }
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { knots } = this.props.knotsStore;
    if (knots.length) {
      return <div>Knots will appear here</div>;
    }

    return <Create />;
  }
}
