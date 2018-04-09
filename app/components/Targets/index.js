// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Header from '../Header';
import Loader from '../Loader';
import Target from './Target';
import styles from './Targets.css';

type Props = {
  targetsStore: {
    targets: Array<{
      key: string,
      name: string,
      logo: string,
      target: string,
      version: string
    }>,
    loading: boolean
  },
  getTargets: () => void
};

export default class Targets extends Component<Props> {
  props: Props;
  componentWillMount() {
    this.props.getTargets();
  }

  render() {
    const { targets } = this.props.targetsStore;
    return (
      <div className={styles.Targets}>
        <Header>Choose a target</Header>
        <div className={styles.targetsBody}>
          {this.props.targetsStore.loading && <Loader />}
          {!this.props.targetsStore.loading && (
            <div>
              <div className={styles.targetsActive}>
                <p>
                  <span className={styles.emphasis}>Targets </span>consume data
                  from taps and do something with it, like load it into a file,
                  API or database.
                </p>
                <div className={styles.targetList}>
                  {targets.map((target) => {
                    if (target.active) {
                      return (
                        <Target
                          key={target.key}
                          name={target.name}
                          logo={target.logo}
                          target={target.key}
                          version={target.version}
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
              <div className={styles.targetsInactive}>
                <span className={styles.emphasis}>Coming soon...</span>
                <div className={styles.targetListInactive}>
                  {targets.map((target) => {
                    if (!target.active) {
                      return (
                        <Target
                          key={target.key}
                          name={target.name}
                          logo={target.logo}
                          target={target.key}
                          version={target.version}
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
              <Link to="/schema">
                <Button>
                  <i className="fa fa-long-arrow-left" aria-hidden="true" />
                  Back: Schema
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}
