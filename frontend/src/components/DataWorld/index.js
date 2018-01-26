import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Button, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './DataWorld.css';

class DataWorld extends Component {
  componentWillMount() {
    this.props.userStore.getDatasets();
  }

  render() {
    return (
      <div className="Taps">
        <Header>
          Configure <span className="emphasis">data.world</span> Connection
        </Header>

        <div className="body">
          <ControlLabel>Dataset</ControlLabel>
          <select>
            {this.props.userStore.datasets.map((dataset) => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </select>
          <div className="navigation">
            <Link to="/schema">
              <Button>
                <i className="fa fa-long-arrow-left" aria-hidden="true" />Back:
                Schema
              </Button>
            </Link>
            <Link to="/finish">
              <Button bsStyle="primary">
                Next: Finish<i
                  className="fa fa-long-arrow-right"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

DataWorld.propTypes = {
  userStore: PropTypes.shape({
    getDatasets: PropTypes.func,
    datasets: PropTypes.object
  }).isRequired
};

export default inject('userStore')(observer(DataWorld));
