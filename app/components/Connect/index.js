// @flow

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Container, Row, Col } from 'reactstrap';
import queryString from 'query-string';

import KnotProgress from '../../containers/KnotProgress';
import Header from '../Header';
import Loader from '../Loader';
import ConnectForm from './ConnectForm';
import Navigation from '../Navigation';
import styles from './Connect.css';

type Props = {
  tapsStore: {
    configLoading: boolean
    // dockerVersion: string,
    // tapFields: Array<{}>,
    // fieldValues: {}
  },
  location: {
    search: string
  },
  fetchTapFields: (tap: string, version: string) => void
  //   setTapFields: (key: string, value: string, index: string) => void,
  //   submitConfig: (config: {}) => void,
  //   getTapConfig: () => void,
  //   setKnot: (knot: string) => string
};

export default class Taps extends Component<Props> {
  props: Props;

  componentWillMount() {
    console.log('tHE PROPS', this.props);
    const { tap, version } = queryString.parse(this.props.location.search);
    // if (this.props.location.state.knot) {
    //   this.props.setKnot(this.props.location.state.knot);
    // }
    this.props.fetchTapFields(tap, version);
    // this.props.getTapConfig();
  }

  // fetchFields() {
  //   const { tap, version } = queryString.parse(this.props.location.search);
  //   this.props.fetchTapFields(tap, version, this.props.location.state.knot);
  // }

  // refresh() {
  //   this.fetchFields();
  // }

  // handleFieldChange = (key: string, value: string, index: string) => {
  //   this.props.setTapFields(key, value, index);
  // };

  // submit = () => {
  //   this.props.submitConfig(this.props.tapsStore.fieldValues);
  // };

  render() {
    const { configLoading } = this.props.tapsStore;

    return (
      <div>
        <Header />
        {configLoading && <Loader />}
        {!configLoading && (
          <div>
            <Container>
              <Row>
                <Col md={{ size: 8, offset: 2 }}>
                  <KnotProgress />
                  <div className="pt-4">
                    <h2>Replication Options</h2>
                    <form className="py-2">
                      <div className="form-group">
                        <label for="inputHostName">Hostname</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputHostName"
                        />
                      </div>
                      <div className="form-group">
                        <label for="inputUserName">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputUserName"
                        />
                      </div>
                      <div className="form-group">
                        <label for="inputPassword">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="inputPassword"
                        />
                      </div>
                      <div className="form-group">
                        <label for="inputDatabase">Database</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputDatabase"
                        />
                      </div>
                      <div className="form-group">
                        <label for="inputSchema">Schema</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputSchema"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary float-right"
                      >
                        Continue
                      </button>
                    </form>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    );
  }
}
