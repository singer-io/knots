// @flow
import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import styles from './ConnectForm.css';

type Props = {
  fields: Array<{
    key: string,
    label: string
  }>,
  handleChange: (event: SyntheticEvent<HTMLButtonElement>) => void,
  submit: () => void
};

export default class ConnectForm extends Component<Props> {
  render() {
    return (
      <Col md={{ size: 8, offset: 2 }} className={styles.ConnectForm}>
        <Form>
          {this.props.fields.map((field) => (
            <FormGroup key={field.key}>
              <Label for={field.label}>{field.label}</Label>
              <Input
                type="string"
                name={field.key}
                id={field.label}
                onChange={this.props.handleChange}
              />
            </FormGroup>
          ))}

          <Button
            color="primary"
            className="float-right"
            onClick={this.props.submit}
          >
            Continue
          </Button>
        </Form>
      </Col>
    );
  }
}
