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
  componentWillMount() {
    this.props.fetchKnots();
  }

  render() {
    const { knots } = this.props.knotsStore;
    if (knots.length) {
      return <div>Knots will appear here</div>;
    }

    return <Create />;
  }
}
