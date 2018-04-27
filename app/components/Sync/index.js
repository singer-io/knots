// @flow

import React, { Component } from 'react';

import { Container, Row, Col } from 'reactstrap';
import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';

import styles from './Sync.css';

export default class Sync extends Component<{}> {
  render() {
    return (
      <div>
        <Header />
        <KnotProgress />
        <Container>
          <Row>
            <Col md={{ size: 8, offset: 2 }} className={styles.logos}>
              <div className={styles.redshift} />
              <div className="col-2 display-1 text-center text-muted">
                <span className="oi oi-chevron-right align-middle" />
              </div>
              <div className={styles.dataDotWorld} />
            </Col>
          </Row>
          <div className="alert alert-primary mt-5 w-75 mx-auto">
            <button type="button" className="btn btn-primary float-right">
              Try now
            </button>
            <strong>Well done!</strong>
            <br /> Your knot is fully configured and ready to run.div
          </div>
        </Container>
      </div>
    );
  }
}
