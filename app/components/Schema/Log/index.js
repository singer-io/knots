import React, { Component } from 'react';
import { scrolled } from 'react-stay-scrolled';

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

    return <pre className="text-muted">{log}</pre>;
  }
}

export default scrolled(Log);
