import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Header from '../Header';

import './Sync.css';

class Sync extends Component {
  constructor() {
    super();

    this.sync = this.sync.bind(this);
  }

  sync() {
    this.props.knotsStore.sync();
  }

  render() {
    return (
      <div className="Connect">
        <Header>Redshift + data.world</Header>
        <div className="sync-body">
          <p>
            <span className="emphasis">Success! </span>
            Your pipeline is ready to be executed.
          </p>
          <div className="sync-knot">
            <div className="to-fro">
              <img
                src="https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png"
                alt="tap logo"
                className="tap-logo"
              />
              <span className="to">&gt;</span>
              <img
                src="https://assets.data.world/assets/jumping_sparkle.5ed7a6ee85ba4718f189bef76607d36d.svg"
                alt="target logo"
                className="target-logo"
              />
            </div>
            {!this.props.knotsStore.loading && (
              <div className="button-container">
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  className="sync-button"
                  onClick={this.sync}
                >
                  Run
                </Button>
              </div>
            )}
            {this.props.knotsStore.loading && (
              <div className="button-container">
                <div className="sync-loader" />{' '}
                <Button bsSize="large" className="sync-button">
                  <div>
                    <ReactLoading
                      type="spin"
                      color="#4688f1"
                      height="40px"
                      width="40px"
                    />
                  </div>
                  <span className="syncing-text">Running</span>
                </Button>
              </div>
            )}
          </div>
          <textarea
            name="live-sync-logs"
            className="live-sync-logs"
            value={this.props.knotsStore.syncLogs}
          />
        </div>
      </div>
    );
  }
}

Sync.propTypes = {
  knotsStore: PropTypes.shape({
    sync: PropTypes.func.isRequired,
    syncLogs: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired
  }).isRequired
};

export default inject('knotsStore')(observer(Sync));
