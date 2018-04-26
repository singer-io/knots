import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TapActions from '../actions/taps';
import Connect from '../components/Connect';

function mapStateToProps(state) {
  return {
    tapsStore: state.taps
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TapActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Connect);
