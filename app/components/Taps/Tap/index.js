// @flow
import React, { Component } from 'react';
import { Col, Card, CardBody } from 'reactstrap';

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

  render() {
    const { tapKey } = this.props;
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
                  <a href={this.props.repo} target="_blank">
                    Learn more
                  </a>
                </small>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
