import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TapsActions from '../actions/taps';
import Taps from '../components/Taps';

function mapStateToProps(state) {
  return {
    tapsStore: state.taps,
    knotsStore: state.knots
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TapsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Taps);
