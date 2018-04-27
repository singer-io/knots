// @flow
import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import DataWorld from '../../containers/DataWorld';

type Props = {
  submitFields: (dataset: string, token: string) => void,
  userStore: { selectedDataset: string, token: string }
};

export default class Target extends Component<Props> {
  submit = () => {
    this.props.submitFields(
      this.props.userStore.selectedDataset,
      this.props.userStore.token
    );
  };

  render() {
    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <DataWorld />
              <Button
                color="primary"
                className="float-right"
                onClick={this.submit}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
