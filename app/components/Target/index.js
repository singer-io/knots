// @flow
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import DataWorld from './DataWorld';

export default class Target extends Component<{}> {
  render() {
    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <DataWorld />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
