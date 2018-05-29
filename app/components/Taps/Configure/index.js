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

import ConfigureForm from './ConfigureForm';

type Props = {
  fields: Array<{
    key: string,
    label: string,
    validationText: string,
    required: boolean,
    options: Array<string>,
    placeholder: string,
    type?: string
  }>,
  fieldValues: {
    password?: string,
    client_id?: string,
    password?: string,
    client_id?: string,
    client_secret?: string,
    refresh_token?: string,
    api_type?: string,
    select_fields_by_default?: boolean
  },
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void,
  submit: () => void,
  setSfRefreshToken: (token: string) => void
};

export default class Configure extends Component<Props> {
  render() {
    return (
      <div>
        <ConfigureForm
          fields={this.props.fields}
          fieldValues={this.props.fieldValues}
          handleChange={this.props.handleChange}
          submit={this.props.submit}
          setSfRefreshToken={this.props.setSfRefreshToken}
        />
      </div>
    );
  }
}
