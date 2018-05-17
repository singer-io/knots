// @flow
import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';

type Props = {
  checked: boolean,
  index: string,
  handleChange: (field: string, index: string, value: boolean) => void
};

type State = {
  checked: boolean
};

export default class Checkbox extends Component<Props, State> {
  constructor(props: Props) {
    super();

    this.state = { checked: props.checked };
  }

  toggle = () => {
    const checked = !this.state.checked;
    this.props.handleChange('selected', this.props.index, checked);
    this.setState({ checked });
  };

  render() {
    return (
      <FormGroup check>
        <Input
          type="checkbox"
          onClick={this.toggle}
          checked={this.state.checked}
        />
      </FormGroup>
    );
  }
}
