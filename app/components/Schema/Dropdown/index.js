// @flow
import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';

type Props = {
  index: string,
  columns: Array<string>,
  handleChange: (field: string, index: string, value: boolean | string) => void
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
