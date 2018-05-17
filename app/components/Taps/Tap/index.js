// @flow
import React, { Component } from 'react';
import { Col, Card, CardBody } from 'reactstrap';
import { shell } from 'electron';

import styles from './Tap.css';

type Props = {
  logo: string,
  name: string,
  repo: string,
  tapKey: string,
  tapImage: string,
  selected: string,
  selectTap: (tap: { name: string, image: string }) => void
};

type State = {
  hovered: boolean
};

export default class Tap extends Component<Props, State> {
  state = {
    hovered: false
  };

  getBorderState = () => {
    const { hovered } = this.state;
    const { tapKey, selected } = this.props;

    if (hovered) {
      return 'border-primary';
    } else if (selected === tapKey) {
      return 'border-success';
    }

    return '';
  };

  openLink = (repo: string) => {
    shell.openExternal(repo);
  };

  render() {
    const { tapKey, repo } = this.props;
    return (
      <Col sm="12" md={{ size: 4 }}>
        <Card
          className={this.getBorderState()}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
          onClick={() => {
            this.props.selectTap({
              name: tapKey,
              image: this.props.tapImage
            });
          }}
        >
          <CardBody>
            <div className="media">
              <img
                src={this.props.logo}
                alt={this.props.name}
                className="mr-3"
                style={{ maxWidth: '44px' }}
              />
              <div className="media-body">
                <h6 className="card-title mb-0">{this.props.name}</h6>
                <small>
                  <button
                    onClick={() => this.openLink(repo)}
                    className={styles.link}
                  >
                    Learn more
                  </button>
                </small>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
