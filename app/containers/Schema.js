import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SchemaActions from '../actions/schema';
import Schema from '../components/Schema';

function mapStateToProps(state) {
  return {
    tapsStore: state.taps
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SchemaActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Schema);
