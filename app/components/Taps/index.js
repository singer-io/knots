// @flow
import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import Loader from '../Loader';
import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Tap from './Tap';

import './Taps.css';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    tapsLoading: boolean,
    taps: Array<{
      logo: string,
      name: string,
      repo: string,
      tapKey: string,
      version: string
    }>
  }
};

export default class Taps extends Component<Props> {
  componentWillMount() {
    this.props.fetchTaps();
  }

  render() {
    const { tapsLoading, taps } = this.props.tapsStore;

    return (
      <div>
        <Header />
        {tapsLoading && <Loader />}
        {!tapsLoading && (
          <Container>
            <KnotProgress />

            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <p className="mt-5">
                  <strong>Taps</strong> extract data from any source and write
                  it to a standard stream.
                </p>
                <div id="accordion">
                  <Card>
                    <CardHeader>Selection</CardHeader>
                    <CardBody>
                      <Col md={{ size: 4 }}>
                        {taps.map((tap) => (
                          <Tap
                            key={tap.tapKey}
                            name={tap.name}
                            logo={tap.logo}
                            repo={tap.repo}
                            tapKey={tap.tapKey}
                            version={tap.version}
                          />
                        ))}
                      </Col>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
