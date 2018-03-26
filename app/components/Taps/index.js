// @flow
import React, { Component } from 'react';

import Header from '../Header';
import Loader from '../Loader';
import Tap from './Tap';
import styles from './Taps.css';

type Props = {
  tapsStore: {
    loading: boolean,
    taps: Array<{
      name: string,
      key: string,
      logo: string,
      repo: string,
      version: string
    }>
  },
  fetchTaps: () => void
};

export default class Taps extends Component<Props> {
  props: Props;

  componentWillMount() {
    this.props.fetchTaps();
  }

  render() {
    const { taps, loading } = this.props.tapsStore;
    return (
      <div className={styles.Create}>
        <Header>Choose a tap</Header>
        <div className={styles.tapsBody}>
          {loading && <Loader />}
          {!loading && (
            <div>
              <div className={styles.tapsActive}>
                <p>
                  <span className={styles.emphasis}>Taps</span> extract data
                  from any source. Choose a tap based on where your data is
                  currently hosted.
                </p>
                <div className={styles.tapList}>
                  {taps.map((tap) => {
                    if (tap.active) {
                      return (
                        <Tap
                          key={tap.key}
                          name={tap.name}
                          logo={tap.logo}
                          repo={tap.repo}
                          tap={tap.key}
                          version={tap.version}
                        />
                      );
                    }
                    return '';
                  })}
                </div>
              </div>
              <div className={styles.tapsInactive}>
                <p>
                  <span className={styles.emphasis}>Coming soon...</span>
                </p>
                <div className={styles.tapListInactive}>
                  {taps.map((tap) => {
                    if (!tap.active) {
                      return <div>{tap.name}</div>;
                    }
                    return '';
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
