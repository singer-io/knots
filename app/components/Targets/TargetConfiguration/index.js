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
  },
  targetsStore: {
    selectedTarget: { name: string, image: string }
  }
};

export default class Target extends Component<Props> {
  submit = () => {
    this.props.submitFields(
      this.props.userStore.selectedDataset,
      this.props.userStore.token
    );
  };

  selectedTarget = () => {
    const { selectedTarget } = this.props.targetsStore;
    switch (selectedTarget.name) {
      case 'target-datadotworld':
        return <DataWorld />;
      default:
        return <div>Unknown Target</div>;
    }
  };

  render() {
    return (
      <div>
        <Container>
          <Row>{this.selectedTarget()}</Row>
        </Container>
      </div>
    );
  }
}
