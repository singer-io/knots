// @flow
import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import styles from './Knot.css';

type Props = {
  knot: { name: string, lastRun: string },
  delete: ({ name: string }) => void
};

export default class Knots extends Component<Props> {
  delete = () => {
    this.props.delete(this.props.knot);
  };

  render() {
    const { knot } = this.props;
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
          <div className="btn-group" role="group" aria-label="Basic example">
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
              onClick={this.delete}
              title="Delete"
            >
              <span className="oi oi-trash" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
}
