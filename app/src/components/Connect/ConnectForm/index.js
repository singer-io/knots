import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import './ConnectForm.css';

const ConnectionForm = (props) => (
  <form>
    <FormGroup controlId="formBasicText">
      {props.fields.map((field) => (
        <div key={field.key}>
          <ControlLabel className="control-label">
            {field.label}
            <span className="normal">
              {field.required ? '' : ' (optional)'}
            </span>
          </ControlLabel>
          <FormControl
            name={field.key}
            type="text"
            onChange={props.handleChange}
          />
        </div>
      ))}
    </FormGroup>
  </form>
);

ConnectionForm.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  fields: PropTypes.object.isRequired, // fields is a mobx array
  handleChange: PropTypes.func.isRequired
};

export default inject('tapsStore')(observer(ConnectionForm));
