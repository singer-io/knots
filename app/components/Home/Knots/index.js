// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import Knot from './Knot';

type Props = {
  knotsStore: {
    knots: Array<{ name: string, lastRun: string }>,
    knotDeleted: boolean
  },
  deleteKnot: (knot: string) => void,
  downloadKnot: (knot: string) => void,
  getKnots: () => void
};

export default class Knots extends Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.knotsStore.knotDeleted) {
      this.props.getKnots();
    }
  }

  delete = (knot: { name: string }) => {
    this.props.deleteKnot(knot.name);
  };

  download = (knot: { name: string }) => {
    this.props.downloadKnot(knot.name);
  };

  render() {
    const { knots } = this.props.knotsStore;
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="display-4">My Knots</p>
          <Link to="/taps">
            <Button color="secondary" outline style={{ height: '50px' }}>
              New Knot
            </Button>
          </Link>
        </div>
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
          {knots.map((knot) => (
            <Knot
              key={knot.name}
              knot={knot}
              delete={this.delete}
              download={this.download}
            />
          ))}
        </table>
      </div>
    );
  }
}
