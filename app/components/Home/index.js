// @flow
import React, { Component } from 'react';
import Header from '../Header';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Home">
        <Header>My Knots</Header>
      </div>
    );
  }
}
