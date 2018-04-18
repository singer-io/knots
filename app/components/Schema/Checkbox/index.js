// @flow

import React, { Component } from 'react';
import styles from './Checkbox.css';

type Props = {
  checked: boolean,
  index: string,
  handleChange: (field: string, index: string, value: string) => void
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
    this.props.handleChange('selected', this.props.index, checked.toString());
    this.setState({ checked });
  };

  render() {
    return (
      // eslint-disable-next-line
      <div className={styles.checkbox} onClick={this.toggle}>
        {this.state.checked && <i className="fa fa-check" aria-hidden="true" />}
      </div>
    );
  }
}
