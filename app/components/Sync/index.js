// @flow

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Header from '../Header';

import styles from './Sync.css';

type Props = {
  knotsStore: { loading: boolean, synced: boolean, syncLogs: string },
  userStore: {
    selectedDataset: string,
    datasets: Array<{ owner: string }>
  },
  sync: () => void,
  syncLiveLogs: () => void
};

export default class Sync extends Component<Props> {
  props: Props;

  sync = () => {
    this.props.sync();
    this.props.syncLiveLogs();
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
            {!this.props.knotsStore.loading &&
              !this.props.knotsStore.synced && (
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
            {this.props.knotsStore.loading &&
              !this.props.knotsStore.synced && (
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
            {!this.props.knotsStore.loading &&
              this.props.knotsStore.synced && (
                <div className="synced">
                  <div className="button-container">
                    <a
                      href={`https://data.world/${
                        this.props.userStore.datasets[0].owner
                      }/${this.props.userStore.selectedDataset}`}
                      target="_blank"
                    >
                      <Button
                        bsStyle="primary"
                        bsSize="large"
                        className="synced-view"
                      >
                        View on data.world
                      </Button>
                    </a>
                  </div>
                </div>
              )}
          </div>
          <textarea
            name="live-sync-logs"
            className={styles.syncLogs}
            value={this.props.knotsStore.syncLogs}
          />
        </div>
      </div>
    );
  }
}
