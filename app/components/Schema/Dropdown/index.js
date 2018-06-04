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
import { FormGroup, Input } from 'reactstrap';

type Props = {
  index: string,
  columns: Array<string>,
  handleChange: (field: string, index: string, value: boolean | string) => void,
  isDisabled: boolean
};

export default class Dropdown extends Component<Props> {
  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    this.props.handleChange('replication-key', this.props.index, value);
  };

  render() {
    if (this.props.columns.length < 1) {
      return 'N/A';
    }

    return (
      <FormGroup style={{ margin: '0' }}>
        <Input
          type="select"
          name="select"
          id="replicationKeys"
          onChange={this.handleChange}
          disabled={this.props.isDisabled}
        >
          <option value="">-</option>
          {this.props.columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </Input>
      </FormGroup>
    );
  }
}
