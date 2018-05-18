import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from '../actions/user';
import Stitch from '../components/Targets/TargetConfiguration/Stitch';

function mapStateToProps(state) {
  return {
    userStore: state.user,
    tapsStore: state.taps
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Stitch);
