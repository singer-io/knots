// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Header from '../../Header';

import styles from './Knots.css';

type Props = {
  knots: Array<string>,
  setKnot: (name: string, value: string) => void,
  download: (name: string) => void,
  configureKnot: (name: string) => void
};

export default class Knots extends Component<Props> {
  setKnot = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.props.setKnot(name, value);
  };

  download = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    this.props.download(name);
  };

  configure = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    this.props.configureKnot(name);
  };

  render() {
    console.log('The props', this.props);

    return (
      <div className={styles.Knots}>
        <Header>My Knots</Header>
        <div className={styles.knotsBody}>
          {this.props.knots.map((knot) => (
            <div className={styles.syncKnot}>
              <div className={styles.toFro}>
                <img
                  src="https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png"
                  alt="tap logo"
                  className={styles.tapLogo}
                />
                <span className="to">&gt;</span>
                <img
                  src="https://assets.data.world/assets/jumping_sparkle.5ed7a6ee85ba4718f189bef76607d36d.svg"
                  alt="target logo"
                  className={styles.targetLogo}
                />
              </div>
              <p>{knot}</p>

              <div className={styles.buttonContainer}>
                <Link to="/sync">
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className="sync-button"
                    name={knot}
                    value="incremental"
                    onClick={this.setKnot}
                  >
                    Run
                  </Button>
                </Link>
              </div>
              <div className="button-container">
                <Link
                  to={{
                    pathname: '/sync',
                    state: { knot }
                  }}
                >
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className="synced-view"
                    name={knot}
                    onClick={this.configure}
                  >
                    Full Sync
                  </Button>
                </Link>
              </div>
              <div className="synced">
                <div className="button-container">
                  <Link
                    to={{
                      pathname: '/connect',
                      state: { from: 'knot-list', knot }
                    }}
                  >
                    <Button
                      bsStyle="primary"
                      bsSize="large"
                      className="synced-view"
                      name={knot}
                      onClick={this.configure}
                    >
                      Configure
                    </Button>
                  </Link>
                </div>
                <div className="button-container">
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className="synced-save"
                    name={knot}
                    onClick={this.download}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="new-knot">
            <Link to="/taps">
              <Button bsStyle="primary" bsSize="large">
                Create New Knot
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
