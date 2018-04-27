// @flow
import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Loader from '../Loader';
import Target from './Target';

type Props = {
  getTargets: () => void,
  targetsStore: {
    targetsLoading: boolean,
    targets: Array<{
      logo: string,
      name: string,
      repo: string,
      targetKey: string,
      version: string
    }>
  }
};

export default class Targets extends Component<Props> {
  componentWillMount() {
    this.props.getTargets();
  }

  render() {
    console.log('The props', this.props);
    const { targetsLoading, targets } = this.props.targetsStore;

    return (
      <div>
        <Header />
        {targetsLoading && <Loader />}
        {!targetsLoading && (
          <Container>
            <KnotProgress />

            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <p className="mt-5">
                  <strong>Targets</strong> consume data from taps and do
                  something with it, like load it into a file, API or database.
                </p>
                <div id="accordion">
                  <Card>
                    <CardHeader>Selection</CardHeader>
                    <CardBody>
                      <Col md={{ size: 4 }}>
                        {targets.map((target) => (
                          <Target {...target} key={target.targetKey} />
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
