import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Header from '../Header';
import Loader from '../Loader';
import Tap from './Tap';
import './Taps.css';

class Taps extends Component {
  componentWillMount() {
    this.props.tapsStore.getTaps();
  }

  render() {
    const { activeTaps, inactiveTaps } = this.props.tapsStore;
    return (
      <div className="Taps">
        <Header>Choose a tap</Header>
        <div className="taps-body">
          {this.props.tapsStore.loading && <Loader />}
          {!this.props.tapsStore.loading && (
            <div>
              <div className="taps-active">
                <p>
                  <span className="emphasis">Taps</span> extract data from any
                  source. Choose a tap based on where your data is currently
                  hosted.
                </p>
                <div className="tap-list">
                  {activeTaps.map((tap) => (
                    <Tap
                      key={tap.key}
                      name={tap.name}
                      logo={tap.logo}
                      repo={tap.repo}
                      tap={tap.key}
                      version={tap.version}
                    />
                  ))}
                </div>
              </div>
              <div className="taps-inactive">
                <p>
                  <span className="emphasis">Coming soon...</span>
                </p>
                <div className="tap-list-inactive">
                  {inactiveTaps.map((tap) => (
                    <Tap
                      key={tap.key}
                      name={tap.name}
                      logo={tap.logo}
                      repo={tap.repo}
                      tap={tap.key}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Taps.propTypes = {
  tapsStore: PropTypes.shape({
    activeTaps: PropTypes.object,
    inactiveTaps: PropTypes.object,
    getTaps: PropTypes.func,
    loading: PropTypes.bool
  }).isRequired
};

export default inject('tapsStore')(observer(Taps));
