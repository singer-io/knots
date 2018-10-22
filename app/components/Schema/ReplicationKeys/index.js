/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

import React, { Component } from 'react';
import Select from 'react-select';

type Props = {
  index: string,
  defaultValue: string,
  replicationKeys: Array<string>,
  handleChange: (field: string, index: string, value: boolean | string) => void
};

export default class ReplicationKeys extends Component<Props> {
  constructor(props) {
    super(props);
    const { defaultValue } = props;

    const selectedOption = defaultValue
      ? { value: defaultValue, label: defaultValue }
      : null;

    this.state = {
      selectedOption
    };
  }

  handleChange = (selectedOption) => {
    this.props.handleChange(
      'replication-key',
      this.props.index,
      selectedOption.value
    );
    this.setState({ selectedOption });
  };

  getOptions = () => {
    const { replicationKeys } = this.props;

    return replicationKeys.map((option) => ({
      value: option,
      label: option
    }));
  };

  render() {
    if (this.props.replicationKeys.length < 1) {
      return 'N/A';
    }

    return (
      <Select
        placeholder="Please select"
        value={this.state.selectedOption}
        onChange={this.handleChange}
        options={this.getOptions()}
      />
    );
  }
}
