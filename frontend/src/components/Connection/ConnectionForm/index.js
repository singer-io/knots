import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import './ConnectionForm.css';

const ConnectionForm = ({ fields }) => (
  <form>
    <FormGroup controlId="formBasicText">
      {fields.map((field) => (
        <div key={field.key}>
          <ControlLabel className="control-label">
            {field.label}
            <span className="normal">
              {field.required ? '' : ' (optional)'}
            </span>
          </ControlLabel>
          <FormControl type="text" value="" onChange={this.handleChange} />
        </div>
      ))}
    </FormGroup>
  </form>
);

ConnectionForm.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  fields: PropTypes.object.isRequired // fields is a mobx array
};

export default ConnectionForm;
