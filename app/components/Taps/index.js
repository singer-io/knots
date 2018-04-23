// @flow
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import Loader from '../Loader';
import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';

import './Taps.css';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    loading: boolean
  }
};

export default class Taps extends Component<Props> {
  componentWillMount() {
    this.props.fetchTaps();
  }

  render() {
    const { loading } = this.props.tapsStore;

    return (
      <div>
        <Header />
        {loading && <Loader />}
        {!loading && (
          <Container>
            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <KnotProgress />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
