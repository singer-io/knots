// @flow
import React, { Component } from 'react';
import { Container, Row, Card, CardHeader, CardBody, Button } from 'reactstrap';
import classNames from 'classnames';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Target from './Target';
import TargetConfiguration from '../../containers/TargetConfiguration';

type Props = {
  getTargets: () => void,
  targetsStore: {
    targetsLoading: boolean,
    targetSelected: boolean,
    targets: Array<{
      logo: string,
      name: string,
      repo: string,
      targetKey: string,
      targetImage: string
    }>,
    targetInstalled: boolean,
    selectedTarget: { name: string, image: string }
  },
  history: { push: (path: string) => void },
  selectTarget: (target: { name: string, image: string }) => void,
  submitFields: () => void
};

type State = {
  showTargets: boolean
};

export default class Targets extends Component<Props, State> {
  state = {
    showTargets: true
  };

  componentWillMount() {
    this.props.getTargets();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.targetsStore.targetSelected) {
      this.setState({ showTargets: false });
    }
  }

  toggleShowTargets = () => {
    this.setState({ showTargets: !this.state.showTargets });
  };

  render() {
    const { showTargets } = this.state;
    const { targets, selectedTarget } = this.props.targetsStore;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Configure Target</h2>
          <p className="mb-4">
            <strong>Targets</strong> consume data from taps and do something
            with it, like load it into a file, API or database.
          </p>

          <div id="accordion">
            <Card className="mt-3">
              <CardHeader>
                <Button color="link" onClick={this.toggleShowTargets}>
                  Selection
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: showTargets
                })}
              >
                <Row>
                  {targets.map((target) => (
                    <Target
                      {...target}
                      key={target.targetKey}
                      selectTarget={this.props.selectTarget}
                      selected={selectedTarget.name}
                    />
                  ))}
                </Row>
              </CardBody>
            </Card>

            <Card className="mt-3">
              <CardHeader>
                <Button color="link" disabled>
                  Configuration
                </Button>
              </CardHeader>
              <CardBody
                className={classNames('collapse', {
                  show: !showTargets && selectedTarget
                })}
              >
                <TargetConfiguration />
              </CardBody>
            </Card>
            <Button color="primary" className="float-right my-3">
              Continue
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}
