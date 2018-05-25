import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TapActions from '../actions/taps';
import Schema from '../components/Schema';

function mapStateToProps(state) {
  return {
    tapsStore: state.taps,
    knotsStore: state.knots
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TapActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Schema);
