// @flow
import { connect } from 'react-redux';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    knotsStore: state.knots
  };
}

export default connect(mapStateToProps)(Home);
