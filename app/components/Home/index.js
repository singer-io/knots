// @flow
import React, { Component } from 'react';

import Create from './Create';

type Props = {
  fetchKnots: () => void
};

export default class Home extends Component<Props> {
  componentWillMount() {
    this.props.fetchKnots();
  }

  render() {
    return <Create />;
  }
}
