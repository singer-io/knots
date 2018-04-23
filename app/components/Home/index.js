// @flow
import React, { Component } from 'react';

import Create from './Create';
// import Knots from './Knots';

// type Props = {
//   fetchKnots: () => void,
//   knotsStore: { knots: Array<string> },
//   download: (name: string) => void,
//   syncMode: (name: string) => void
// };

export default class Home extends Component<{}> {
  // componentWillMount() {
  //   this.props.fetchKnots();
  // }

  render() {
    // if (this.props.knotsStore) {
    //   if (this.props.knotsStore.knots.length > 0) {
    //     return <div>Knots will appear here</div>;
    //   }
    // }

    return <Create />;
  }
}
