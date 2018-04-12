// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ControlLabel, Table } from 'react-bootstrap';
import ReactLoading from 'react-loading';

import Header from '../Header';
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
    loading: boolean,
    liveLogs: string
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
  fetchSchema: () => void,
  discoveryLiveLogs: () => void
};

export default class Schema extends Component<Props> {
  componentWillMount() {
    this.props.discoveryLiveLogs();
    setTimeout(() => {
      this.props.fetchSchema();
    }, 4000);
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
          {this.props.tapsStore.loading && (
            <div>
              <ReactLoading
                type="spin"
                color="#4688f1"
                height="40px"
                width="40px"
              />
              <p className="info-text">Retrieving schema information...</p>
              <textarea
                name="live-logs"
                className={styles.log}
                value={this.props.tapsStore.liveLogs}
              />
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
                <Link to="/connect">
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
