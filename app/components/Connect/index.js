// @flow

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import queryString from 'query-string';

import Header from '../Header';
import Loader from '../Loader';
import ConnectForm from './ConnectForm';
import Navigation from '../Navigation';
import styles from './Connect.css';

type Props = {
  tapsStore: {
    loading: boolean,
    dockerVersion: string,
    tapFields: Array<{}>,
    fieldValues: {}
  },
  location: {
    search: string
  },
  fetchTapFields: (tap: string, version: string) => void,
  setTapFields: (key: string, value: string, index: string) => void,
  submitConfig: (config: {}) => void,
  getTapConfig: () => void
};

export default class Taps extends Component<Props> {
  props: Props;

  componentWillMount() {
    this.fetchFields();
    this.props.getTapConfig();
  }

  fetchFields() {
    const { tap, version } = queryString.parse(this.props.location.search);
    this.props.fetchTapFields(tap, version);
  }

  refresh() {
    this.fetchFields();
  }

  handleFieldChange = (key: string, value: string, index: string) => {
    this.props.setTapFields(key, value, index);
  };

  submit = () => {
    this.props.submitConfig(this.props.tapsStore.fieldValues);
  };

  render() {
    const { loading, dockerVersion } = this.props.tapsStore;
    if (!dockerVersion) {
      return (
        <div>
          <Header>Install Docker</Header>
          <div className={styles.docker}>
            <div className={styles.dockerText}>
              Install Docker from{' '}
              <a
                href="https://www.docker.com/community-edition#/download"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docker Download
              </a>{' '}
              to continue
            </div>
            <Button className={styles.dockerButton} onClick={this.refresh}>
              Ok I have installed Docker
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header>
          Configure <span className={styles.emphasis}>Redshift</span> Connection
        </Header>
        <div className={styles.connectBody}>
          {loading && <Loader />}
          {!loading && (
            <div>
              <ConnectForm
                fields={this.props.tapsStore.tapFields}
                handleChange={this.handleFieldChange}
              />
              <Navigation
                back={{ name: 'Taps', path: '/taps' }}
                next={{
                  name: 'Schema',
                  path: '/schema',
                  onClick: this.submit
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
