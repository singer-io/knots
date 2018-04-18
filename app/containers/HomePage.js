import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as KnotsActions from '../actions/knots';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    knotsStore: state.knots
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KnotsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
