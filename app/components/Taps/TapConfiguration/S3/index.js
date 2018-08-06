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
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row
} from 'reactstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import {
  openLink,
  toISODateString,
  formatDate
} from '../../../../utils/handlers';
import styles from './S3.css';

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9
};
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

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
  bucket: string,
  start_date: string,
  tables: [
    {
      table_name: string,
      key_properties: string,
      search_pattern: string,
      tags: Array,
      preCommittedTags: string
    }
  ]
};

export default class S3 extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      bucket: '',
      start_date: '',
      tables: [
        {
          table_name: '',
          key_properties: '',
          search_pattern: '',
          tags: [],
          preCommittedTags: ''
        }
      ]
    };
  }

  componentWillMount = () => {
    const { tables } = this.props.tapsStore['tap-s3-csv'].fieldValues;
    const tableValues = tables
      ? JSON.parse(tables)
      : [
          {
            table_name: '',
            key_properties: '',
            search_pattern: '',
            tags: [],
            preCommittedTags: '',
            validation: {}
          }
        ];

    let tagsArr = [];
    tableValues.map((tableValue) => {
      const tableRow = tableValue;
      const { key_properties } = tableRow;
      const keyPropsArray = key_properties.split(',');
      if (keyPropsArray.length > 0 && keyPropsArray[0] !== '') {
        tagsArr = keyPropsArray.map((val) => ({
          id: val,
          text: val
        }));
      }

      tableRow.tags = tagsArr;
      tableRow.validation = {};
      return tableRow;
    });

    this.setState({
      tables: tableValues
    });
  };

  componentWillUnmount = () => {
    const newTable = this.state.tables.map((table) => {
      const { preCommittedTags } = table;
      const tagObj = {};
      tagObj.id = preCommittedTags;
      tagObj.text = preCommittedTags;
      const updatedTag = [...table.tags, tagObj];
      const keyProperties = this.updateKeyProperties(updatedTag);
      return { ...table, key_properties: keyProperties, tags: updatedTag };
    });

    const tableToStore = JSON.stringify(this.removeKeysFromTable(newTable));
    this.props.updateTapField('tap-s3-csv', 'tables', tableToStore);
  };

  validate = (field: string, value: string) => {
    if (value) {
      this.setState({ [field]: { valid: true } });
    } else {
      this.setState({ [field]: { invalid: true } });
    }
  };

  setValidatedTableField = (idx, field, fieldState) => {
    this.setState((prevState) => {
      const newTable = [...prevState.tables];
      newTable[idx].validation[field] = { [fieldState]: true };
      return { tables: newTable };
    });
  };

  validateTableFields = (field: string, value: string, idx: number) => {
    if (field === 'table_name') {
      if (value.length >= 3) {
        this.setValidatedTableField(idx, field, 'valid');
      } else {
        this.setValidatedTableField(idx, field, 'invalid');
      }
    }

    if (field === 'search_pattern') {
      // Match input value for special characters
      // \, ^, `, >, <, {, }, [, ], #, %, ", ~, |
      const valid = !value.match(/\^|\\|`|>|<|{|}|]|\[|#|%|""|~|\|/);
      if (value.length !== 0 && valid) {
        this.setValidatedTableField(idx, field, 'valid');
      } else {
        this.setValidatedTableField(idx, field, 'invalid');
      }
    }
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let { value } = e.currentTarget;

    if (name === 'start_date') {
      value = toISODateString(new Date(value));
    }

    this.props.updateTapField('tap-s3-csv', name, value);
  };

  handleAddTable = () => {
    this.setState({
      tables: this.state.tables.concat([
        {
          table_name: '',
          key_properties: '',
          search_pattern: '',
          tags: [],
          validation: {}
        }
      ])
    });
  };

  handleRemoveTable = (idx) => () => {
    const newTable = this.state.tables.filter((table, sidx) => idx !== sidx);
    this.updateTable(newTable);
  };

  removeKeysFromTable = (tables) => {
    const updatedTable = tables.map((table) => {
      const { tags, preCommittedTags, validation, ...withoutTags } = table;
      return withoutTags;
    });
    return updatedTable;
  };

  updateTable = (newTable) => {
    this.setState({ tables: newTable }, () => {
      const tableToStore = this.removeKeysFromTable(this.state.tables);
      this.props.updateTapField(
        'tap-s3-csv',
        'tables',
        JSON.stringify(tableToStore)
      );
    });
  };

  updateKeyProperties = (tags) => {
    const keyProperties = tags.map((elem) => {
      const values = elem.text;
      return values;
    });
    return keyProperties.toString();
  };

  handleTableChange = (idx, field) => (evt) => {
    const newTable = this.state.tables.map((table, sidx) => {
      if (idx !== sidx) return table;
      if (field === 'table_name') {
        return { ...table, table_name: evt.target.value };
      } else if (field === 'key_properties') {
        const updatedTag = [...table.tags, evt];
        const keyProperties = this.updateKeyProperties(updatedTag);
        return {
          ...table,
          key_properties: keyProperties,
          tags: updatedTag
        };
      }
      return { ...table, search_pattern: evt.target.value };
    });
    this.updateTable(newTable);
  };

  handleTagsDelete = (idx) => {
    const newTable = this.state.tables.filter((table) => {
      const tableCopy = table;
      tableCopy.tags = tableCopy.tags.filter((el, index) => index !== idx);
      tableCopy.key_properties = this.updateKeyProperties(tableCopy.tags);
      return tableCopy;
    });
    this.updateTable(newTable);
  };

  handleTagInputChange = (idx) => (option) => {
    const newTable = this.state.tables.map((table, index) => {
      if (idx !== index) return table;
      const cloneTable = table;
      cloneTable.preCommittedTags = option;
      return cloneTable;
    });
    this.setState({ tables: newTable });
  };

  render() {
    const { bucket, start_date } = this.props.tapsStore[
      'tap-s3-csv'
    ].fieldValues;
    const patternErrorMessage =
      'Pattern cannot empty and cannot contain the characters ^, `, >, <, {, }, [, ], #, %, ", ~, |';

    return (
      <Container>
        <Alert color="primary">
          <h4>What you need to know</h4>
          <p>
            This tap will process sets of CSV files whose S3 keys match a
            pattern (regular expression). Those files will be converted into a
            table and the provided key field(s) used as its primary key.
          </p>
          <p>
            <strong>IMPORTANT</strong>: This tap requires the{' '}
            <a
              href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html"
              onClick={openLink}
            >
              AWS Command Line Interface
            </a>{' '}
            to be{' '}
            <a
              href="https://docs.aws.amazon.com/cli/latest/userguide/installing.html"
              onClick={openLink}
            >
              installed
            </a>{' '}
            and{' '}
            <a
              href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html"
              onClick={openLink}
            >
              configured
            </a>.
          </p>
        </Alert>
        <Form>
          <Row>
            <Col xs="11">
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
            <Col xs="12" className="mt-3">
              <FormGroup>
                <Label for="bucket">Tables</Label>
                {this.state.tables.map((table, idx) => (
                  <Row key={table.name}>
                    <Col xs="11">
                      <Card className="mt-3">
                        <Row className="p-3">
                          <Col xs="6">
                            <FormGroup>
                              <Label for="table_name">Table name</Label>
                              <Input
                                bsSize="sm"
                                type="text"
                                name="table_name"
                                id="table_name"
                                placeholder="myfile.csv"
                                value={table.table_name}
                                onChange={this.handleTableChange(
                                  idx,
                                  'table_name'
                                )}
                                onBlur={(event) => {
                                  const { value } = event.currentTarget;
                                  this.validateTableFields(
                                    'table_name',
                                    value,
                                    idx
                                  );
                                }}
                                {...this.state.tables[idx].validation
                                  .table_name}
                              />
                              <FormFeedback>
                                Must have a minimum of 3 characters
                              </FormFeedback>
                            </FormGroup>
                          </Col>
                          <Col xs="6">
                            <FormGroup>
                              <Label for="search_pattern">S3 key pattern</Label>
                              <Input
                                bsSize="sm"
                                type="text"
                                name="search_pattern"
                                id="search_pattern"
                                value={table.search_pattern}
                                onChange={this.handleTableChange(
                                  idx,
                                  'search_pattern'
                                )}
                                onBlur={(event) => {
                                  const { value } = event.currentTarget;
                                  this.validateTableFields(
                                    'search_pattern',
                                    value,
                                    idx
                                  );
                                }}
                                {...this.state.tables[idx].validation
                                  .search_pattern}
                              />
                              <FormFeedback>{patternErrorMessage}</FormFeedback>
                            </FormGroup>
                          </Col>
                          <Col>
                            <Label for="key_properties">Key field(s)</Label>
                            <ReactTags
                              name="key_properties"
                              id="key_properties"
                              tags={table.tags}
                              handleAddition={this.handleTableChange(
                                idx,
                                'key_properties'
                              )}
                              handleDelete={this.handleTagsDelete}
                              handleInputChange={this.handleTagInputChange(idx)}
                              delimiters={delimiters}
                              placeholder="Press [enter] after each"
                              autofocus={false}
                              classNames={{
                                tag: styles.inputTagValue,
                                tagInputField: 'form-control form-control-sm',
                                tagInput: 'd-inline-block',
                                remove: styles.removeTag
                              }}
                              inline
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col>
                      <Button
                        className="mt-3"
                        size="sm"
                        onClick={this.handleRemoveTable(idx)}
                        outline
                        class="close"
                        color="danger"
                        aria-label="Delete"
                      >
                        <span aria-hidden="true">&times;</span>
                      </Button>
                    </Col>
                  </Row>
                ))}
              </FormGroup>
            </Col>
            <Col xs="2" className="mb-3">
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
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label for="start_date">Start date (for backfilling)</Label>
                <Input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={start_date ? formatDate(start_date) : ''}
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
        </Form>
      </Container>
    );
  }
}
