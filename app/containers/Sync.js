import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as KnotActions from '../actions/knots';
import Sync from '../components/Sync';

function mapStateToProps(state) {
  return {
    knotsStore: state.knots,
    userStore: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KnotActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sync);
