import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as userActions from '../actions/user';
import Target from '../components/Target';

function mapStateToProps(state) {
  return {
    userStore: state.user,
    targetsStore: state.targets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(userActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Target);
