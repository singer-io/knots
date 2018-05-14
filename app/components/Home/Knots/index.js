// @flow
import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import styles from './Knots.css';

type Props = {
  knotsStore: {
    knots: Array<{ name: string, lastRun: string }>
  }
};

export default class Knots extends Component<Props> {
  render() {
    const { knots } = this.props.knotsStore;
    console.log('The props', this.props);
    return (
      <div className="container mt-5">
        <p className="display-4">My Knots</p>
        <table className="table">
          <thead className="thead-light">
            <th className="text-center pr-0" style={{ width: '6em' }}>
              Tap
            </th>
            <th className="px-0 fit" />
            <th className="text-center pl-0" style={{ width: '6em' }}>
              Target
            </th>
            <th>Name</th>
            <th>Last Run</th>
            <th className="fit">Actions</th>
          </thead>
          {knots.map((knot) => {
            return (
              <tr key={knot.name}>
                <td className="align-middle pr-0">
                  <div className={classNames(styles.tapRedshift, 'mx-auto')} />
                </td>
                <td className="align-middle px-0 text-muted text-center">
                  <span className="oi oi-chevron-right" />
                </td>
                <td className="align-middle pl-0">
                  <div className={classNames(styles.datadotworld, 'mx-auto')} />
                </td>
                <th>{knot.name}</th>
                <td>{moment(knot.lastRun).fromNow()}</td>
                <td className="fit">
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      style={{ background: 'white' }}
                      type="button"
                      className="btn btn-link"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Run"
                    >
                      <span className="oi oi-media-play" />
                    </button>
                    <button
                      style={{ background: 'white' }}
                      type="button"
                      className="btn btn-link-secondary"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Full sync"
                    >
                      <span className="oi oi-reload" />
                    </button>
                    <button
                      style={{ background: 'white' }}
                      type="button"
                      className="btn btn-link-secondary"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                    >
                      <span className="oi oi-pencil" />
                    </button>
                    <button
                      style={{ background: 'white' }}
                      type="button"
                      className="btn btn-link-secondary"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Download"
                    >
                      <span className="oi oi-cloud-download" />
                    </button>
                    <button
                      style={{ background: 'white' }}
                      type="button"
                      className="btn btn-link-secondary"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                    >
                      <span className="oi oi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
