import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as knotActions from '../actions/knots';
import Sync from '../components/Sync';

function mapStateToProps(state) {
  return {
    knotsStore: state.knots,
    userStore: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(knotActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sync);
