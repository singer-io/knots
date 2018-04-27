// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import DataWorld from '../../containers/DataWorld';

type Props = {
  submitFields: (dataset: string, token: string) => void,
  userStore: {
    selectedDataset: string,
    token: string,
    targetConfigured: boolean
  }
};

export default class Target extends Component<Props> {
  submit = () => {
    this.props.submitFields(
      this.props.userStore.selectedDataset,
      this.props.userStore.token
    );
  };

  render() {
    if (this.props.userStore.targetConfigured) {
      return <Redirect push to="/sync" />;
    }

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
