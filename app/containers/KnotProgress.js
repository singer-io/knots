import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ProgressActions from '../actions/progress';
import KnotProgress from '../components/KnotProgress';

function mapStateToProps(state) {
  return {
    progressStore: state.progress
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProgressActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KnotProgress);
