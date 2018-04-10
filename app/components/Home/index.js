// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

import Create from './Create';

type Props = {
  knotsStore: {
    knots: Array<string>
  },
  fetchKnots: () => void
};

export default class Home extends Component<Props> {
  props: Props;
  constructor() {
    super();

    ipcRenderer.on('dataworld-oauth-reply', (event, token) => {
      console.log('It has happened', token.access_token);
    });
  }

  componentWillMount() {
    this.props.fetchKnots();
  }

  doIt() {
    console.log('Clicked');
    ipcRenderer.send('dataworld-oauth', 'getToken');
  }

  render() {
    console.log('The props', this.props);
    console.log('The window', window);
    const { knots } = this.props.knotsStore;
    if (knots.length) {
      return <div>Knots will appear here</div>;
    }

    return (
      <div>
        <Create />
        <button onClick={this.doIt}>Click me</button>
      </div>
    );
  }
}
