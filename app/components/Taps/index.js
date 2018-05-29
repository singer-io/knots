// @flow
/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

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
      placeholder: string,
      options: Array<string>,
      type?: string
    }>,
    fieldValues: {
      password?: string,
      client_id?: string,
      client_secret?: string,
      refresh_token?: string,
      api_type?: string,
      select_fields_by_default?: boolean
    }
  },
  knotsStore: { knotName: string },
  history: { push: (path: string) => void },
  selectTap: (tap: { name: string, image: string }) => void,
  updateTapField: (key: string, value: string) => void,
  submitConfig: (
    selectedTap: { name: string, image: string },
    fieldValues: {},
    knotName: string
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
    const { knotName } = this.props.knotsStore;

    this.props.submitConfig(selectedTap, fieldValues, knotName);
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
    const { knotName } = this.props.knotsStore;
    const { showTaps } = this.state;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Configure Tap</h2>
          <p className="mb-4">
            <strong>Taps</strong> extract data from any source and write it to a
            standard stream.
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
                      knotName={knotName}
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
