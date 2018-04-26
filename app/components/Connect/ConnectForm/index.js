/* eslint-disable */
import React, { Component } from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap';

import styles from './ConnectForm.css';

export default class ConnectForm extends Component<Props, State> {
  render() {
    return (
      <Col md={{ size: 8, offset: 2 }} className={styles.ConnectForm}>
        <Form>
          {this.props.fields.map((field) => {
            return (
              <FormGroup key={field.key}>
                <Label for={field.label}>{field.label}</Label>
                <Input type="string" name={field.key} id={field.label} />
              </FormGroup>
            );
          })}

          <Button color="primary" className="float-right">
            Continue
          </Button>
        </Form>
      </Col>
    );
  }
}
