import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import Knots from './Knots';
import Create from './Create';

import './Home.css';

class Home extends Component {
  constructor() {
    super();

    this.fetchKnots = this.fetchKnots.bind(this);
  }

  componentWillMount() {
    this.fetchKnots();
  }

  fetchKnots() {
    this.props.knotsStore.getKnots();
  }

  render() {
    const { knots } = this.props.knotsStore;
    if (knots.length) {
      return <Knots knots={knots} />;
    }
    return <Create />;
  }
}

Home.propTypes = {
  knotsStore: PropTypes.shape({
    getKnots: PropTypes.func,
    knots: PropTypes.object
  }).isRequired
};

export default inject('knotsStore')(observer(Home));
