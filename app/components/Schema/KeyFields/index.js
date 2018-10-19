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
  index: number,
  streamMetadata: { index?: number, metadata?: {} },
  columns: Array<string>,
  modifySchema: (index: number, field: string, value: Array) => void
};

export default class KeyFields extends Component<Props> {
  constructor(props) {
    super();

    const { streamMetadata } = props;
    if (streamMetadata.index !== undefined) {
      const isView = streamMetadata.metadata['is-view'];
      const keyProperties =
        streamMetadata.metadata[
          isView ? 'view-key-properties' : 'table-key-properties'
        ] || [];
      const modifyTableKeys = keyProperties.length === 0;

      this.state = {
        isView,
        modifyTableKeys,
        selectedOptions: keyProperties.map((option) => ({
          value: option,
          label: option
        }))
      };
    }
  }

  handleChange = (selectedOptions) => {
    const metadataIndex = this.props.streamMetadata.index;
    const propertyType = this.state.isView
      ? 'view-key-properties'
      : 'table-key-properties';

    this.props.modifySchema(
      this.props.index,
      `metadata[${metadataIndex}].metadata[${propertyType}]`,
      selectedOptions.map((option) => option.value)
    );
    this.setState({ selectedOptions });
  };

  getOptions = () => {
    const { keyProperties, modifyTableKeys } = this.state;
    const { columns } = this.props;
    const options = modifyTableKeys ? keyProperties : columns;

    return options.map((option) => ({
      value: option,
      label: option
    }));
  };

  render() {
    if (this.props.streamMetadata.index === undefined) {
      return 'N/A';
    }

    const { isView, modifyTableKeys } = this.state;
    const fieldEditable = isView || modifyTableKeys;

    return (
      <Select
        isMulti
        isDisabled={!fieldEditable}
        placeholder={fieldEditable ? 'Add key' : ''}
        value={this.state.selectedOptions}
        onChange={this.handleChange}
        options={this.getOptions()}
      />
    );
  }
}
