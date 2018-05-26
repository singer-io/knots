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
import { Col, Card, CardBody } from 'reactstrap';
import { shell } from 'electron';

import styles from './Target.css';

type Props = {
  logo: string,
  name: string,
  repo: string,
  targetKey: string,
  targetImage: string,
  selected: string,
  selectTarget: (
    tap: { name: string, image: string },
    knotName: string
  ) => void,
  knotName: string
};

type State = {
  hovered: boolean
};

export default class Target extends Component<Props, State> {
  state = {
    hovered: false
  };

  getBorderState = () => {
    const { hovered } = this.state;
    const { targetKey, selected } = this.props;

    if (hovered) {
      return 'border-primary';
    } else if (selected === targetKey) {
      return 'border-success';
    }

    return '';
  };

  openLink = (repo: string) => {
    shell.openExternal(repo);
  };

  render() {
    const { targetKey, repo, knotName } = this.props;
    return (
      <Col sm="12" md={{ size: 4 }}>
        <Card
          className={this.getBorderState()}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
          onClick={() => {
            this.props.selectTarget(
              {
                name: targetKey,
                image: this.props.targetImage
              },
              knotName
            );
          }}
        >
          <CardBody>
            <div className="media">
              <img
                src={this.props.logo}
                alt={this.props.name}
                className="mr-3"
                style={{ maxWidth: '44px' }}
              />
              <div className="media-body">
                <h6 className="card-title mb-0">{this.props.name}</h6>
                <small>
                  <button
                    onClick={() => this.openLink(repo)}
                    className={styles.link}
                  >
                    Learn more
                  </button>
                </small>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
