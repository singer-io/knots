import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as targetActions from '../actions/targets';
import Target from '../components/Targets/TargetConfiguration';

function mapStateToProps(state) {
  return {
    userStore: state.user,
    targetsStore: state.targets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(targetActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Target);
