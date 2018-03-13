import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Button, FormControl, ControlLabel } from 'react-bootstrap';

import './DataWorld.css';

class DataWorld extends Component {
  componentWillMount() {
    if (this.props.userStore.token) {
      this.props.userStore.getDatasets();
    }
  }
  render() {
    return (
      <div className="DataWorld">
        {this.props.userStore.token && (
          <div>
            <ControlLabel className="control-label">API Token</ControlLabel>
            <FormControl
              name="dataset"
              type="text"
              value={this.props.userStore.token}
              readOnly
            />
          </div>
        )}
        {!this.props.userStore.token && (
          <div>
            <div className="button-label">API Token</div>
            <a href="https://data.world/oauth/authorize?client_id=knot-local&redirect_uri=http://localhost:3000/callback&response_type=code">
              <Button bsStyle="primary">Log in with data.world</Button>
            </a>
          </div>
        )}
        <div>
          <ControlLabel>Dataset</ControlLabel>
          <select onChange={this.handleChange}>
            {this.props.userStore.datasets.map((dataset) => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

DataWorld.propTypes = {
  userStore: PropTypes.shape({
    token: PropTypes.string,
    getDatasets: PropTypes.func,
    datasets: PropTypes.object
  }).isRequired
};

export default inject('userStore')(observer(DataWorld));
