// @flow

import React, { Component } from 'react';
import Header from '../Header';
import Loader from '../Loader';
import Navigtion from '../Navigation';
import DataWorld from '../../containers/DataWorld';

import styles from './Target.css';

type Props = {
  submitFields: (dataset: string, token: string) => void,
  targetsStore: { loading: boolean },
  userStore: { selectedDataset: string, token: string }
};

export default class Target extends Component<Props> {
  submitFields = () => {
    this.props.submitFields(
      this.props.userStore.selectedDataset,
      this.props.userStore.token
    );
  };

  render() {
    return (
      <div className={styles.Connect}>
        <Header>
          Configure <span className={styles.emphasis}>data.world</span>{' '}
          Connection
        </Header>
        <div className={styles.connectBody}>
          {this.props.targetsStore.loading && <Loader />}
          <DataWorld />
          {!this.props.targetsStore.loading && (
            <div>
              <Navigtion
                back={{ name: 'Targets', path: '/targets' }}
                next={{
                  name: 'Finish',
                  path: '/sync',
                  onClick: this.submitFields
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
