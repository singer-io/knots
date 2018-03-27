import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from '../actions/user';
import DataWorld from '../components/Target/DataWorld';

function mapStateToProps(state) {
  return {
    userStore: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataWorld);
