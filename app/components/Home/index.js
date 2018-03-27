// @flow
import React, { Component } from 'react';
import Create from './Create';

type Props = {
  knotsStore: {
    knots: Array<string>
  },
  fetchKnots: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  componentWillMount() {
    this.props.fetchKnots();
  }

  render() {
    console.log('The props', this.props);
    console.log('The window', window);
    const { knots } = this.props.knotsStore;
    if (knots.length) {
      return <div>Knots will appear here</div>;
    }

    return <Create />;
  }
}
