// @flow
import React, { Component } from 'react';

export default class Knots extends Component<{}> {
  render() {
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
          <tr>
            <td className="align-middle pr-0">
              <div className="redshift mx-auto" />
            </td>
            <td className="align-middle px-0 text-muted text-center">
              <span className="oi oi-chevron-right" />
            </td>
            <td className="align-middle pl-0">
              <div className="datadotworld mx-auto" />
            </td>
            <th>Purchase Orders</th>
            <td>10 minutes ago</td>
            <td className="fit">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn btn-link"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Run"
                >
                  <span className="oi oi-media-play" />
                </button>
                <button
                  type="button"
                  className="btn btn-link-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Full sync"
                >
                  <span className="oi oi-reload" />
                </button>
                <button
                  type="button"
                  className="btn btn-link-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                >
                  <span className="oi oi-pencil" />
                </button>
                <button
                  type="button"
                  className="btn btn-link-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Download"
                >
                  <span className="oi oi-cloud-download" />
                </button>
                <button
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
          <tr>
            <td className="align-middle pr-0">
              <div className="redshift mx-auto" />
            </td>
            <td className="align-middle px-0 text-muted text-center">
              <span className="oi oi-chevron-right" />
            </td>
            <td className="align-middle pl-0">
              <div className="datadotworld mx-auto" />
            </td>
            <th>Prospects</th>
            <td>1 day ago</td>
            <td className="fit">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn btn-link"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Run"
                >
                  <span className="oi oi-media-play" />
                </button>
                <button
                  type="button"
                  className="btn btn-link-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Full sync"
                >
                  <span className="oi oi-reload" />
                </button>
                <button
                  type="button"
                  className="btn btn-link-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                >
                  <span className="oi oi-pencil" />
                </button>
                <button
                  type="button"
                  className="btn btn-link-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Download"
                >
                  <span className="oi oi-cloud-download" />
                </button>
                <button
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
        </table>
      </div>
    );
  }
}
