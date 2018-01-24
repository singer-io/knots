import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Header from '../Header';
import Tap from './Tap';
import './Taps.css';

class Taps extends Component {
  componentWillMount() {
    this.props.tapsStore.getTaps();
  }

  render() {
    const { taps } = this.props.tapsStore;
    return (
      <div className="Taps">
        <Header>Choose a tap</Header>
        <div className="body">
          <p>
            <span className="emphasis">Taps</span> extract data from any source.
            Choose a tap based on where your data is currently hosted.
          </p>
          <div className="tap-list">
            {taps.map((tap) => (
              <Tap
                key={tap.key}
                name={tap.name}
                logo={tap.logo}
                repo={tap.repo}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Taps.propTypes = {
  tapsStore: PropTypes.shape({
    taps: PropTypes.object,
    getTaps: PropTypes.func
  }).isRequired
};

export default inject('tapsStore')(observer(Taps));
