// @flow
import React, { Component } from 'react';

import Create from './Create';
import Knots from './Knots';

type Props = {
  fetchKnots: () => void,
  knotsStore: { knots: Array<string> },
  download: (name: string) => void
};

export default class Home extends Component<Props> {
  componentWillMount() {
    this.props.fetchKnots();
  }

  render() {
    console.log('THe props');
    if (this.props.knotsStore) {
      if (this.props.knotsStore.knots.length > 0) {
        return (
          <Knots
            knots={this.props.knotsStore.knots}
            download={this.props.download}
          />
        );
      }
    }

    return <Create />;
  }
}
