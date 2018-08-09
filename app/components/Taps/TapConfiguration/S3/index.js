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
/* eslint-disable camelcase */

import React, { Component } from 'react';
import {
  Alert,
  Button,
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
import classNames from 'classnames';
import TagsInput from 'react-tagsinput';
import { formatDate, openLink } from '../../../../utils/handlers';
import styles from './S3.css';

type TapS3ConfigType = TapConfigType<{
  bucket: string,
  tables: string
}>;

type PropsType = {
  tap: TapS3ConfigType,
  updateTapConfig: (tap: string, tapConfig: TapS3ConfigType) => void
};

type ValidatedFieldType = {
  valid: boolean,
  message?: string
};

type TableType = {
  table_name: string,
  key_properties: Array<string>,
  search_pattern: string
};

type StateType = {
  bucket: string,
  start_date: string,
  tables: Array<TableType>,
  validation: {
    [string]: ValidatedFieldType,
    tables: Array<{
      [string]: ValidatedFieldType
    }>
  }
};

class S3 extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);

    const { tables } = props.tap.fieldValues;
    let newTables;

    if (tables !== '' && JSON.parse(tables)) {
      newTables = JSON.parse(tables).map((item) => ({
        ...item,
        key_properties: item.key_properties.split(',')
      }));
    }

    this.state = {
      ...props.tap.fieldValues,
      tables: newTables || [
        {
          table_name: '',
          search_pattern: '',
          key_properties: []
        }
      ],
      validation: {
        tables: []
      }
    };
  }

  validate = () => {
    const { bucket, tables, start_date } = this.state;
    return {
      valid:
        this.validateBucket(bucket).valid &&
        this.validateTables(tables).valid &&
        this.validateStartDate(start_date).valid
    };
  };

  validateBucket = (bucket?: string) => ({
    valid: !!bucket,
    message: 'Required'
  });

  validateTables = (tables: Array<TableType>) =>
    tables.reduce(
      (prev, cur) => ({
        valid: prev.valid && this.validateTable(cur).valid
      }),
      { valid: true }
    );

  validateTable = (table: TableType) => {
    const { table_name, search_pattern, key_properties } = table;
    return {
      valid:
        this.validateTableName(table_name).valid &&
        this.validateSearchPattern(search_pattern).valid &&
        this.validateKeyProperties(key_properties).valid
    };
  };

  validateTableName = (table_name?: string) => ({
    valid: !!table_name && table_name.length >= 3,
    message:
      table_name && table_name.length < 3 ? 'Minimum 3 characters' : 'Required'
  });

  validateSearchPattern = (search_pattern?: string) => {
    let valid = !!search_pattern;
    let message = 'Required';
    if (valid) {
      try {
        RegExp(search_pattern);
      } catch (error) {
        valid = false;
        message = error.message || message;
      }
    }
    return { valid, message };
  };

  validateKeyProperties = () => ({
    valid: true
  });

  validateStartDate = (start_date?) => ({
    valid: !!start_date,
    message: 'Required'
  });

  handleBucketChange = async (e, validate = false) => {
    const { value: bucket } = e.currentTarget;
    await this.updateFormState(
      'bucket',
      bucket,
      (validate && this.validateBucket(bucket)) || null
    );
  };

  handleStartDateChange = async (e, validate = false) => {
    const { value: start_date } = e.currentTarget;
    await this.updateFormState(
      'start_date',
      (start_date && formatDate(start_date)) || '',
      (validate && this.validateStartDate(start_date)) || null
    );
  };

  handleTableNameChange = async (e, idx, validate = false) => {
    const { value: table_name } = e.currentTarget;
    await this.updateTableState(
      idx,
      'table_name',
      table_name,
      (validate && this.validateTableName(table_name)) || null
    );
  };

  handleSearchPatternChange = async (e, idx, validate = false) => {
    const { value: search_pattern } = e.currentTarget;
    await this.updateTableState(
      idx,
      'search_pattern',
      search_pattern,
      (validate && this.validateSearchPattern(search_pattern)) || null
    );
  };

  handleKeyPropertiesChange = async (key_properties, idx, validate = false) => {
    await this.updateTableState(
      idx,
      'key_properties',
      key_properties,
      (validate && this.validateKeyProperties(key_properties)) || null
    );
  };

  updateTableState = async (
    idx,
    field,
    value,
    validation = { valid: true }
  ) => {
    const {
      tables,
      validation: { tables: tableValidation }
    } = this.state;
    const newTables = Object.assign([...tables], {
      [idx]: {
        ...tables[idx],
        [field]: value
      }
    });
    const newTableValidations = Object.assign([...tableValidation], {
      [idx]: {
        ...tableValidation[idx],
        [field]: validation
      }
    });
    await this.updateFormState('tables', newTables, newTableValidations);
  };

  updateFormState = async (field, value, validation?) => {
    await this.setState({
      [field]: value,
      validation: {
        ...this.state.validation,
        [field]: validation || { valid: true }
      }
    });

    const { bucket, tables, start_date } = this.state;
    const newTables = tables.map((item) => ({
      ...item,
      key_properties: item.key_properties.toString()
    }));

    this.props.updateTapConfig('tap-s3-csv', {
      fieldValues: {
        bucket,
        tables: JSON.stringify(newTables),
        start_date
      },
      valid: this.validate().valid
    });
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

  handleRemoveTable = async (idx) => {
    const newTables = this.state.tables.filter((table, sidx) => idx !== sidx);
    const newTableValidations = this.state.validation.tables.filter(
      (table, sidx) => idx !== sidx
    );
    await this.updateFormState('tables', newTables, newTableValidations);
  };

  render() {
    const { bucket, start_date, validation } = this.state;

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
          <FormGroup row>
            <Col>
              <Label for="bucket">Bucket name</Label>
              <Input
                type="text"
                name="bucket"
                value={bucket}
                onChange={this.handleBucketChange}
                onBlur={(e) => this.handleBucketChange(e, true)}
                invalid={!!validation.bucket && !validation.bucket.valid}
              />
              <FormFeedback>Required</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup tag="fieldset" row>
            <Container>
              <Row>
                <Col>
                  <legend>Tables</legend>
                </Col>
              </Row>
              <Row>
                <Col xs="3" className="pr-1">
                  <p className="m-0">Table name</p>
                </Col>
                <Col xs="3" className="px-1">
                  <p className="m-0">Name pattern</p>
                </Col>
                <Col className="pl-1">
                  <p className="m-0">Key fields</p>
                </Col>
              </Row>
              {this.state.tables.map((table, idx) => (
                <Row className="mb-1">
                  <Col xs="3" className="pr-1">
                    <Input
                      bsSize="sm"
                      type="text"
                      name="table_name"
                      placeholder="my_table"
                      value={table.table_name}
                      onChange={(e) => this.handleTableNameChange(e, idx)}
                      onBlur={(e) => this.handleTableNameChange(e, idx, true)}
                      invalid={
                        !!validation.tables[idx] &&
                        validation.tables[idx].table_name &&
                        !validation.tables[idx].table_name.valid
                      }
                    />
                    <FormFeedback>
                      {!!validation.tables[idx] &&
                        validation.tables[idx].table_name &&
                        validation.tables[idx].table_name.message}
                    </FormFeedback>
                  </Col>
                  <Col xs="3" className="px-1">
                    <Input
                      bsSize="sm"
                      type="text"
                      name="search_pattern"
                      placeholder="myfile\.csv"
                      value={table.search_pattern}
                      onChange={(e) => this.handleSearchPatternChange(e, idx)}
                      onBlur={(e) =>
                        this.handleSearchPatternChange(e, idx, true)
                      }
                      invalid={
                        !!validation.tables[idx] &&
                        validation.tables[idx].search_pattern &&
                        !validation.tables[idx].search_pattern.valid
                      }
                    />
                    <FormFeedback>
                      {!!validation.tables[idx] &&
                        validation.tables[idx].search_pattern &&
                        validation.tables[idx].search_pattern.message}
                    </FormFeedback>
                  </Col>
                  <Col className="px-1">
                    <TagsInput
                      addOnBlur="true"
                      className="form-control form-control-sm"
                      focusedClassName="form-control form-control-sm"
                      tagProps={{
                        className: `badge badge-primary ${styles['tag-badge']}`,
                        classNameRemove: styles['tag-remove']
                      }}
                      inputProps={{
                        className: styles['transparent-input'],
                        placeholder: 'Enter fields'
                      }}
                      value={table.key_properties}
                      onChange={(tags) =>
                        this.handleKeyPropertiesChange(tags, idx)
                      }
                      onBlur={(tags) =>
                        this.handleKeyPropertiesChange(tags, idx, true)
                      }
                    />
                  </Col>
                  <Col xs="auto" className="d-flex align-items-center">
                    <button
                      type="button"
                      className={classNames('close', { invisible: idx === 0 })}
                      aria-label="Delete table"
                      onClick={() => this.handleRemoveTable(idx)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </Col>
                </Row>
              ))}
              <Row>
                <Col>
                  <Button
                    className="mt-2"
                    size="sm"
                    outline
                    color="secondary"
                    onClick={this.handleAddTable}
                  >
                    Add Table
                  </Button>
                </Col>
              </Row>
            </Container>
          </FormGroup>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label for="start_date">Start date (for backfilling)</Label>
                <Input
                  type="date"
                  name="start_date"
                  value={start_date}
                  onChange={this.handleStartDateChange}
                  onBlur={(e) => this.handleStartDateChange(e, true)}
                  invalid={
                    !!validation.start_date && !validation.start_date.valid
                  }
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

export default S3;
export type { TapS3ConfigType };
