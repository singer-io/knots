import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Button, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './DataWorld.css';

class DataWorld extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.submitDataset = this.submitDataset.bind(this);
  }

  componentWillMount() {
    this.props.userStore.getDatasets();
  }

  handleChange(e) {
    const { value } = e.target;
    this.props.userStore.setDataset(value);
  }

  submitDataset() {
    this.props.userStore.submitDataset();
  }

  render() {
    this.props.userStore.setDataset(this.props.userStore.datasets[0] || '');
    return (
      <div className="Taps">
        <Header>
          Configure <span className="emphasis">data.world</span> Connection
        </Header>

        <div className="body">
          <ControlLabel>Dataset</ControlLabel>
          <select onChange={this.handleChange}>
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
              <Button bsStyle="primary" onClick={this.submitDataset}>
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
    setDataset: PropTypes.func,
    submitDataset: PropTypes.func,
    datasets: PropTypes.object
  }).isRequired
};

export default inject('userStore')(observer(DataWorld));
