import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ConnectActions from '../actions/connect';
import Connect from '../components/Connect';

function mapStateToProps(state) {
  return {
    tapsStore: state.taps
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ConnectActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Connect);
