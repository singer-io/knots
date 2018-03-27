import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as KnotActions from '../actions/knots';
import Sync from '../components/Sync';

function mapStateToProps(state) {
  return {
    knotsStore: state.knots
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KnotActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sync);
