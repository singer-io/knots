// @flow
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Label, Input, FormFeedback, FormGroup, InputGroup } from 'reactstrap';

import styles from './Stitch.css';

type Props = {
  userStore: {
    stitch: {
      fieldValues: { client_id: string, token: string }
    }
  },
  updateField: (target: string, name: string, value: string) => void
};

export default class Stitch extends Component<Props> {
  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    this.props.updateField('stitch', name, value);
  };

  render() {
    // eslint-disable-next-line camelcase
    const { client_id, token } = this.props.userStore.stitch.fieldValues;
    return (
      <div className={styles.Stitch}>
        <FormGroup>
          <Label for="apiToken">Client ID</Label>
          <InputGroup>
            <Input
              name="client_id"
              onChange={this.handleChange}
              value={client_id}
              invalid={!client_id}
            />
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="apiToken">Token</Label>
          <InputGroup>
            <Input
              name="token"
              type="password"
              onChange={this.handleChange}
              value={token}
              invalid={!token}
            />
            <FormFeedback>Required</FormFeedback>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }
}
