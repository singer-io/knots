// @flow
import React, { Component } from 'react';
import { Container, Row, Card, CardHeader, CardBody, Button } from 'reactstrap';
import classNames from 'classnames';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Tap from './Tap';
import Configure from './Configure';

import './Taps.css';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    selectedTap: { name: string, image: string },
    tapsLoading: boolean,
    sfToken?: string,
    taps: Array<{
      logo: string,
      name: string,
      repo: string,
      tapKey: string,
      tapImage: string
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
  selectTap: (tap: { name: string, image: string }) => void,
  updateTapField: (key: string, value: string) => void,
  submitConfig: (
    selectedTap: { name: string, image: string },
    fieldValues: {}
  ) => void
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

  setSfRefreshToken = (token: string) => {
    this.props.updateTapField('refresh_token', token);
  };

  render() {
    const {
      taps,
      tapFields,
      fieldValues,
      sfToken,
      selectedTap
    } = this.props.tapsStore;
    const { showTaps } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Configure Tap</h2>
          <p className="mb-4">
            Taps extract data from any source and write it to a standard stream.
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
                <Row>
                  {taps.map((tap) => (
                    <Tap
                      key={tap.name}
                      {...tap}
                      selectTap={this.props.selectTap}
                      selected={selectedTap.name}
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
                  show: !showTaps && tapFields.length > 0
                })}
              >
                <Configure
                  fields={tapFields}
                  fieldValues={fieldValues}
                  submit={this.submit}
                  handleChange={this.handleChange}
                  setSfRefreshToken={this.setSfRefreshToken}
                  sfToken={sfToken}
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
        </Container>
      </div>
    );
  }
}
