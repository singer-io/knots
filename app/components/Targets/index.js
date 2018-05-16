// @flow
import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button
} from 'reactstrap';
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
    targetInstalled: boolean
  },
  userStore: {
    token: string,
    selectedDataset: string
  },
  history: { push: (path: string) => void },
  selectTarget: (tap: string, version: string) => void,
  submitFields: (dataset: string, token: string) => void
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

  formValid = () => {
    const { token, selectedDataset } = this.props.userStore;

    return token && selectedDataset.split('/').length === 2;
  };

  submit = () => {
    this.props.submitFields(
      this.props.userStore.selectedDataset,
      this.props.userStore.token
    );

    this.props.history.push('/sync');
  };

  render() {
    const { showTargets } = this.state;
    const { targets } = this.props.targetsStore;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />

          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <p className="mt-5">
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
                    <Col md={{ size: 4 }}>
                      <div id="collapseOne" aria-labelledby="headingOne">
                        {targets.map((target) => (
                          <Target
                            {...target}
                            key={target.targetKey}
                            selectTarget={this.props.selectTarget}
                          />
                        ))}
                      </div>
                    </Col>
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
                      show: !showTargets
                    })}
                  >
                    <TargetConfiguration />
                  </CardBody>
                </Card>
              </div>
              <Button
                color="primary"
                className="float-right my-3"
                disabled={!this.formValid()}
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
