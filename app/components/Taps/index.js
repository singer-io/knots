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
import Tap from './Tap';
import Configure from './Configure';

import './Taps.css';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    selectedTap: string,
    tapsLoading: boolean,
    taps: Array<{
      logo: string,
      name: string,
      repo: string,
      tapKey: string,
      version: string
    }>,
    tapFields: Array<{
      key: string,
      label: string,
      validationText: string,
      required: boolean,
      placeholder: string
    }>,
    fieldValues: {
      password?: string,
      client_id?: string
    }
  },
  history: { push: (path: string) => void },
  selectTap: (tap: string, version: string) => void,
  updateTapField: (key: string, value: string) => void,
  submitConfig: (selectedTap: string, fieldValues: {}) => void
};

type State = {
  showTaps: boolean
};

export default class Taps extends Component<Props, State> {
  state = {
    showTaps: true
  };

  componentWillMount() {
    this.props.fetchTaps();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tapsStore.tapFields.length > 0) {
      this.setState({ showTaps: false });
    }
  }

  toggleShowTaps = () => {
    this.setState({ showTaps: !this.state.showTaps });
  };

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = event.currentTarget;
    this.props.updateTapField(name, value);
  };

  formValid = () => {
    const validState = this.props.tapsStore.tapFields.map((field) => {
      if (field.required) {
        if (!this.props.tapsStore.fieldValues[field.key]) {
          return false;
        }
      }

      return true;
    });

    if (validState.indexOf(false) > -1) {
      return false;
    }

    return true;
  };

  submit = () => {
    const { selectedTap, fieldValues } = this.props.tapsStore;
    this.props.submitConfig(selectedTap, fieldValues);
    this.props.history.push('/schema');
  };

  setSfRefreshToken = (token) => {
    this.props.updateTapField('refresh_token', token);
  };

  render() {
    const { taps, tapFields } = this.props.tapsStore;
    const { showTaps } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />

          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <p className="mt-4">
                <strong>Taps</strong> extract data from any source and write it
                to a standard stream.
              </p>
              <div id="accordion">
                <Card className="mt-3">
                  <CardHeader>
                    <Button color="link" onClick={this.toggleShowTaps}>
                      Selection
                    </Button>
                  </CardHeader>
                  <CardBody
                    className={classNames('collapse', {
                      show: this.state.showTaps
                    })}
                  >
                    <Col md={{ size: 4 }}>
                      <div id="collapseOne" aria-labelledby="headingOne">
                        {taps.map((tap) => (
                          <Tap
                            {...tap}
                            key={tap.tapKey}
                            selectTap={this.props.selectTap}
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
                      show: !showTaps && tapFields.length > 0
                    })}
                  >
                    <Configure
                      fields={this.props.tapsStore.tapFields}
                      fieldValues={this.props.tapsStore.fieldValues}
                      submit={this.submit}
                      handleChange={this.handleChange}
                      setSfRefreshToken={this.setSfRefreshToken}
                      sfToken={this.props.tapsStore.sfToken}
                    />
                  </CardBody>
                </Card>
              </div>
              <Button
                color="primary"
                className="float-right my-3"
                onClick={this.submit}
                disabled={!this.formValid()}
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
