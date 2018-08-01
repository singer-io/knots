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
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */

import React, { Component } from 'react';
import {
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Button,
  Alert,
  Table
} from 'reactstrap';

import CreatableSelect from 'react-select/lib/Creatable';

const components = {
  DropdownIndicator: null
};

type Props = {
  tapsStore: {
    'tap-s3-csv': {
      fieldValues: {
        bucket: string,
        start_date: string,
        tables: string
      }
    }
  },
  updateTapField: (tap: string, field: string, value: string | number) => void
};
type State = {
  bucket: '',
  start_date: '',
  tables: [{ table_name: '', key_properties: [], search_pattern: '' }]
};

export default class S3 extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      bucket: '',
      start_date: '',
      tables: [{ table_name: '', key_properties: [], search_pattern: '' }]
    };
  }

  componentWillMount = () => {
    const { tables } = this.props.tapsStore['tap-s3-csv'].fieldValues;
    const tableValue = tables
      ? JSON.parse(tables)
      : [{ table_name: '', key_properties: [], search_pattern: '' }];
    this.setState({ tables: tableValue });
  };

  updateStringifiedFieldValue = (value) => {
    const tableValue = JSON.stringify(value);
    this.props.updateTapField('tap-s3-csv', 'tables', tableValue);
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  toISODateString = (date: Date) => {
    const pad = (number) => (number < 10 ? `0${number}` : number);

    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
      date.getUTCDate()
    )}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
      date.getUTCSeconds()
    )}Z`;
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'start_date') {
      value = this.toISODateString(new Date(value));
    }

    this.props.updateTapField('tap-s3-csv', name, value);
  };

  formatDate = (ISODate: string) => {
    const date = new Date(ISODate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  };

  handleAddTable = () => {
    this.setState({
      tables: this.state.tables.concat([
        {
          table_name: '',
          key_properties: [],
          search_pattern: ''
        }
      ])
    });
  };

  handleRemoveTable = (idx) => () => {
    this.setState(
      {
        tables: this.state.tables.filter((s, sidx) => idx !== sidx)
      },
      () => {
        this.updateStringifiedFieldValue(this.state.tables);
      }
    );
  };

  handleTableChange = (idx) => (evt) => {
    const newTable = this.state.tables.map((table, sidx) => {
      if (idx !== sidx) return table;
      return { ...table, table_name: evt.target.value };
    });

    this.setState({ tables: newTable }, () => {
      this.updateStringifiedFieldValue(this.state.tables);
    });
  };

  handleKeyFieldChange = (idx) => (option) => {
    const keyProperties = option.map((elem) => {
      const values = elem.value;
      return values;
    });

    const newTable = this.state.tables.map((table, sidx) => {
      if (idx !== sidx) return table;
      return { ...table, key_properties: keyProperties.toString() };
    });

    this.setState({ tables: newTable }, () => {
      this.updateStringifiedFieldValue(this.state.tables);
    });
  };

  handleSearchPatternChange = (idx) => (evt) => {
    const newTable = this.state.tables.map((table, sidx) => {
      if (idx !== sidx) return table;
      return { ...table, search_pattern: evt.target.value };
    });

    this.setState({ tables: newTable }, () => {
      this.updateStringifiedFieldValue(this.state.tables);
    });
  };

  render() {
    const { bucket, start_date } = this.props.tapsStore[
      'tap-s3-csv'
    ].fieldValues;

    return (
      <Container>
        <Alert color="primary">
          <h4>Shhh... Here is a secret!</h4>
          <p>
            This tap will process sets of CSV files whose S3 keys match a
            pattern (regular expression). Those files will be converted into a
            table and the provided key field(s) used as its primary key.
          </p>
          <p>
            Also, make sure to configure aws by running;{' '}
            <code>aws configure</code> you will be prompted for configuration
            values such as your AWS Access Key Id and you AWS Secret Access Key
            needed to connect to the desired s3.
          </p>
        </Alert>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label for="bucket">Bucket name</Label>
                <Input
                  type="text"
                  name="bucket"
                  id="bucket"
                  value={bucket}
                  onFocus={() => {
                    this.setState({ bucket: {} });
                  }}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('bucket', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.bucket}
                />
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="start_date">Start date</Label>
                <Input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={start_date ? this.formatDate(start_date) : ''}
                  onBlur={(event) => {
                    const { value } = event.currentTarget;
                    this.validate('start_date', value);
                  }}
                  onChange={this.handleChange}
                  {...this.state.start_date}
                />
                <FormText>
                  Applies to tables with a defined timestamp field and limits
                  how much historical data will be replicated.
                </FormText>
                <FormFeedback>Required</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Table className="table-borderless">
              <thead>
                <tr>
                  <th className="font-weight-normal">Table name</th>
                  <th className="font-weight-normal">Key field(s)</th>
                  <th className="font-weight-normal">S3 key pattern</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tables.map((table, idx) => (
                  <tr>
                    <td>
                      <Input
                        type="text"
                        name="table_name"
                        id="table_name"
                        value={table.table_name}
                        onChange={this.handleTableChange(idx)}
                        {...this.state.tables.table_name}
                      />
                    </td>
                    <td>
                      <CreatableSelect
                        components={components}
                        isClearable
                        isMulti
                        onChange={this.handleKeyFieldChange(idx)}
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="search_pattern"
                        id="search_pattern"
                        value={table.search_pattern}
                        onChange={this.handleSearchPatternChange(idx)}
                        {...this.state.tables.search_pattern}
                      />
                    </td>
                    <td>
                      <Button
                        outline
                        color="danger"
                        onClick={this.handleRemoveTable(idx)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Col>
              <Button
                className="mb-1"
                outline
                color="secondary"
                onClick={this.handleAddTable}
              >
                Add Table
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}
