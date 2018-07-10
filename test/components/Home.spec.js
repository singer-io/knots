import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../../app/components/Home';
import Knots from '../../app/components/Home/Knots';

const actions = {
  verifyDocker: () => {},
  resetStore: () => {},
  getKnots: () => {}
};

const sampleKnots = [
  {
    tap: {
      name: 'tap-redshift',
      image: 'dataworld/tap-redshift:1.0.0b8'
    },
    target: {
      name: 'target-datadotworld',
      image: 'dataworld/target-datadotworld:1.0.1'
    },
    name: 'knot1'
  },
  {
    tap: {
      name: 'tap-salesforce',
      image: 'dataworld/tap-salesforce:1.4.14'
    },
    target: {
      name: 'target-stitch',
      image: 'dataworld/target-stitch:1.7.4'
    },
    name: 'knot2'
  }
];

describe('Home component', () => {
  it('Detects when Docker is not installed', () => {
    const knotsStore = {
      detectingDocker: false,
      dockerVerified: true,
      dockerVersion: '',
      dockerRunning: false,
      fetchingKnots: false,
      knots: []
    };

    const component = (
      <Router>
        <Home {...actions} knotsStore={knotsStore} />
      </Router>
    );

    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Detects when Docker is not running', () => {
    const knotsStore = {
      detectingDocker: false,
      dockerVerified: true,
      dockerVersion: '18.03.1-ce-mac65 (24312)',
      dockerRunning: false,
      fetchingKnots: false,
      knots: []
    };

    const component = (
      <Router>
        <Home {...actions} knotsStore={knotsStore} />
      </Router>
    );

    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Shows jumbotron when there are no saved knots', () => {
    const knotsStore = {
      detectingDocker: false,
      dockerVerified: true,
      dockerVersion: '18.03.1-ce-mac65 (24312)',
      dockerRunning: true,
      fetchingKnots: false,
      knots: []
    };

    const component = (
      <Router>
        <Home {...actions} knotsStore={knotsStore} />
      </Router>
    );

    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Shows saved knots', () => {
    const props = {
      knotsStore: {
        knots: sampleKnots,
        knotDeleted: false,
        knotError: false,
        knotLoaded: false
      },
      dockerInstalled: true,
      dockerRunning: true,
      deleteKnot: (knot) => {},
      downloadKnot: (knot) => {},
      getKnots: () => {},
      loadValues: (knot) => {},
      history: { push: (path) => {} }
    };

    const component = (
      <Router>
        <Knots {...props} />
      </Router>
    );

    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Disables knot actions when Docker is not installed', () => {
    const props = {
      knotsStore: {
        knots: sampleKnots,
        knotDeleted: false,
        knotError: false,
        knotLoaded: false
      },
      dockerInstalled: false,
      dockerRunning: false,
      deleteKnot: (knot) => {},
      downloadKnot: (knot) => {},
      getKnots: () => {},
      loadValues: (knot) => {},
      history: { push: (path) => {} }
    };

    const component = (
      <Router>
        <Knots {...props} />
      </Router>
    );

    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Disables knot actions when Docker is not running', () => {
    const props = {
      knotsStore: {
        knots: sampleKnots,
        knotDeleted: false,
        knotError: false,
        knotLoaded: false
      },
      dockerInstalled: true,
      dockerRunning: false,
      deleteKnot: (knot) => {},
      downloadKnot: (knot) => {},
      getKnots: () => {},
      loadValues: (knot) => {},
      history: { push: (path) => {} }
    };

    const component = (
      <Router>
        <Knots {...props} />
      </Router>
    );

    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
