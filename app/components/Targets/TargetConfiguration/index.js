// @flow
import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';

import DataWorld from '../../../containers/DataWorld';

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
    return (
      <div>
        <Container>
          <Row>
            <DataWorld />
          </Row>
        </Container>
      </div>
    );
  }
}
