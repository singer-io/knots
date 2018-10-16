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
import { Input } from 'reactstrap';
import TagsInput from 'react-tagsinput';
import type Metadata from '../../../utils/sharedTypes';

type Props = {
  index: number,
  streamMetadata: Metadata,
  modifySchema: (index: number, field: string, value: Array) => void
};

export default class KeyFields extends Component<Props> {
  constructor() {
    super();
    this.state = { keys: [] };
  }

  handleChange = (keys) => {
    this.props.modifySchema(
      this.props.index,
      `metadata[${
        this.props.streamMetadata.index
      }].metadata['table-key-properties']`,
      keys
    );
    this.setState({ keys });
  };

  render() {
    const { streamMetadata } = this.props;
    const tableKeys = streamMetadata.metadata['table-key-properties'];
    if (tableKeys.length > 0) {
      return <Input value={tableKeys.join(', ')} disabled />;
    }

    return (
      <TagsInput
        addOnBlur
        onlyUnique
        inputProps={{
          placeholder: 'Add key'
        }}
        value={this.state.keys}
        onChange={this.handleChange}
        onBlur={this.handleChange}
      />
    );
  }
}
