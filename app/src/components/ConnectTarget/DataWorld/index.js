import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import './DataWorld.css';

class DataWorld extends Component {
  render() {
    return (
      <div className="DataWorld">
        <div className="button-label">API Token</div>
        <Button bsStyle="primary">Log in with data.world</Button>
        <FormGroup controlId="formBasicText">
          <div>
            <ControlLabel className="control-label">Dataset</ControlLabel>
            <FormControl
              name="dataset"
              type="text"
              onChange={this.handleChange}
            />
          </div>
        </FormGroup>
      </div>
    );
  }
}

export default inject('targetsStore')(observer(DataWorld));
