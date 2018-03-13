import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import './DataWorld.css';

const DataWorld = (props) => (
  <div className="DataWorld">
    {props.userStore.token && (
      <div>
        <ControlLabel className="control-label">API Token</ControlLabel>
        <FormControl
          name="dataset"
          type="text"
          value={props.userStore.token}
          readOnly
        />
      </div>
    )}
    {!props.userStore.token && (
      <div>
        <div className="button-label">API Token</div>
        <a href="https://data.world/oauth/authorize?client_id=knot-local&redirect_uri=http://localhost:3000/callback&response_type=code">
          <Button bsStyle="primary">Log in with data.world</Button>
        </a>
      </div>
    )}
    <FormGroup controlId="formBasicText">
      <div>
        <ControlLabel className="control-label">Dataset</ControlLabel>
        <FormControl name="dataset" type="text" onChange={this.handleChange} />
      </div>
    </FormGroup>
  </div>
);

DataWorld.propTypes = {
  userStore: PropTypes.shape({
    token: PropTypes.string
  }).isRequired
};

export default inject('userStore')(observer(DataWorld));
