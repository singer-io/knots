// @flow

import React, { Component } from 'react';
import { ControlLabel } from 'react-bootstrap';

type Props = {
  getDatasets: (token: string) => void,
  handleChange: (e: SyntheticEvent<HTMLButtonElement>) => void,
  datasets: Array<string>,
  token: string
};

export default class DataWorld extends Component<Props> {
  props: Props;

  componentWillMount() {
    console.log('Will mount');
    this.props.getDatasets(this.props.token);
  }

  render() {
    return (
      <div>
        <ControlLabel>Dataset</ControlLabel>
        <select onChange={this.props.handleChange}>
          {this.props.datasets.map((dataset) => (
            <option key={dataset} value={dataset}>
              {dataset}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
