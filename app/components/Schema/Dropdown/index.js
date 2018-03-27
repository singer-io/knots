// @flow
import React, { Component } from 'react';

type Props = {
  index: string,
  columns: Array<string>,
  handleChange: (field: string, index: string, value: string) => void
};

export default class Dropdown extends Component<Props> {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    this.props.handleChange('replication_key', this.props.index, value);
  };

  render() {
    return (
      <select onChange={this.handleChange}>
        {this.props.columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
    );
  }
}
