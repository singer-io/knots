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

// @flow

import React, { Component } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

type Props = {
  checked: boolean,
  toggleModal: (checkBoxState: boolean) => void,
  updateLogBaseRepMethod: (usesLogBaseRepMethod: boolean) => void
};

type State = {
  checked: boolean
};

export default class Checkbox extends Component<Props, State> {
  state = { checked: this.props.checked };

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ checked: nextProps.checked });
  }

  handleChange = (e) => {
    const checkBoxState = e.target.checked;
    if (!checkBoxState) {
      this.props.updateLogBaseRepMethod(false);
    }
    this.props.toggleModal(checkBoxState);
    this.setState({ checked: checkBoxState });
  };

  render() {
    return (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            onClick={this.handleChange}
            checked={this.state.checked}
          />
          Use incremental sync?
        </Label>
      </FormGroup>
    );
  }
}
