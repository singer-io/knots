// @flow

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Header from '../Header';

import styles from './Sync.css';

type Props = {
  knotsStore: { loading: boolean },
  sync: () => void
};

export default class Sync extends Component<Props> {
  sync = () => {
    this.props.sync();
  };

  render() {
    return (
      <div>
        <Header>Redshift + data.world</Header>
        <div className={styles.syncBody}>
          <p>
            <span className={styles.emphasis}>Success! </span>
            Your pipeline is ready to be executed.
          </p>
          <div className={styles.syncKnot}>
            <div className={styles.toFro}>
              <img
                src="https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png"
                alt="tap logo"
                className={styles.tapLogo}
              />
              <span className={styles.to}>&gt;</span>
              <img
                src="https://assets.data.world/assets/jumping_sparkle.5ed7a6ee85ba4718f189bef76607d36d.svg"
                alt="target logo"
                className={styles.targetLogo}
              />
            </div>
            {!this.props.knotsStore.loading && (
              <div className={styles.buttonContainer}>
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  className={styles.syncButton}
                  onClick={this.sync}
                >
                  Run
                </Button>
              </div>
            )}
            {this.props.knotsStore.loading && (
              <div className={styles.buttonContainer}>
                <div className={styles.syncLoader} />{' '}
                <Button bsSize="large" className={styles.syncButton}>
                  <div>
                    <ReactLoading
                      type="spin"
                      color="#4688f1"
                      height="40px"
                      width="40px"
                    />
                  </div>
                  <span className={styles.syncingText}>Running</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
