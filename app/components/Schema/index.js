// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ControlLabel, Table } from 'react-bootstrap';

import Header from '../Header';
import Loader from '../Loader';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import styles from './Schema.css';

type Props = {
  tapsStore: {
    tapSchema: Array<{
      stream: string,
      tap_stream_id: string,
      table_name: string,
      metadata: Array<{ metadata: { selected?: string } }>,
      schema: { properties: {} }
    }>,
    loading: boolean
  },
  editField: (field: string, index: string, value: string) => void,
  submitSchema: (
    state: Array<{
      stream: string,
      tap_stream_id: string,
      table_name: string,
      metadata: Array<{ metadata: { selected?: string } }>,
      schema: { properties: {} }
    }>
  ) => void,
  fetchSchema: () => void
};

export default class Schema extends Component<Props> {
  componentWillMount() {
    this.props.fetchSchema();
  }

  handleChange = (field: string, index: string, value: string) => {
    this.props.editField(field, index, value);
  };

  submitSchema = () => {
    this.props.submitSchema(this.props.tapsStore.tapSchema);
  };

  render() {
    return (
      <div className={styles.Schema}>
        <Header>
          Configure <span className="emphasis">Redshift</span> Schema
        </Header>

        <div className={styles.schemaBody}>
          {this.props.tapsStore.loading && <Loader />}
          {this.props.tapsStore.loading && (
            <div className={styles.loadingInfo}>
              Retrieving Schema Information
            </div>
          )}
          {!this.props.tapsStore.loading && (
            <div>
              <Table bordered condensed hover>
                <thead>
                  <tr>
                    <th>Table/Stream</th>
                    <th>Selected</th>
                    <th>Replication Property</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.tapsStore.tapSchema.map((stream, index) => (
                    <tr valign="middle" key={stream.tap_stream_id}>
                      <td className={styles.stream}>{stream.table_name}</td>
                      <td className={styles.selected}>
                        <Checkbox
                          checked={!!stream.metadata[0].metadata.selected}
                          index={index.toString()}
                          handleChange={this.handleChange}
                        />
                      </td>
                      <td className={styles.replication}>
                        <Dropdown
                          columns={Object.keys(stream.schema.properties)}
                          index={index.toString()}
                          handleChange={this.handleChange}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <form>
                <ControlLabel>Start Date</ControlLabel>
                <input type="date" className={styles.date} />
              </form>
              <div className={styles.navigation}>
                <Link to="/connection">
                  <Button>
                    <i className="fa fa-long-arrow-left" aria-hidden="true" />Back:
                    Connection
                  </Button>
                </Link>
                <Link to="/targets">
                  <Button bsStyle="primary" onClick={this.submitSchema}>
                    Next: Select Tap<i
                      className="fa fa-long-arrow-right"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
