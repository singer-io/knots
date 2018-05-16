import React, { Component } from 'react';
import { scrolled } from 'react-stay-scrolled';
import classNames from 'classnames';

import styles from './Log.css';

type Props = {
  log: text,
  stayScrolled: () => void
};

class Log extends Component<Props> {
  componentDidMount() {
    const { stayScrolled } = this.props;
    stayScrolled();
  }

  render() {
    const { log } = this.props;

    return <pre className={classNames(styles.wrap, 'text-muted')}>{log}</pre>;
  }
}

export default scrolled(Log);
