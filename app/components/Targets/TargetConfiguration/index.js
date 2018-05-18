// @flow
import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';

import DataWorld from '../../../containers/DataWorld';
import Stitch from '../../../containers/Stitch';

type Props = {
  targetsStore: {
    selectedTarget: { name: string, image: string }
  }
};

export default class Target extends Component<Props> {
  selectedTarget = () => {
    const { selectedTarget } = this.props.targetsStore;
    switch (selectedTarget.name) {
      case 'target-datadotworld':
        return <DataWorld />;
      case 'target-stitch':
        return <Stitch />;
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
