import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TargetsActions from '../actions/targets';
import Targets from '../components/Targets';

function mapStateToProps(state) {
  return {
    targetsStore: state.targets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TargetsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Targets);
