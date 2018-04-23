// @flow
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import Loader from '../Loader';
import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';

import './Taps.css';

type Props = {
  fetchTaps: () => void,
  tapsStore: {
    loading: boolean
  }
};

export default class Taps extends Component<Props> {
  componentWillMount() {
    this.props.fetchTaps();
  }

  render() {
    const { loading } = this.props.tapsStore;
    console.log('THEdfd', this.props);

    return (
      <div>
        <Header />
        {loading && <Loader />}
        {!loading && (
          <Container>
            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <KnotProgress />
              </Col>
            </Row>
            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <p className="mt-5">
                  <strong>Taps</strong> extract data from any source and write
                  it to a standard stream.
                </p>
                <div id="accordion">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <p className="mb-0">
                        <button
                          className="btn btn-link"
                          data-toggle="collapse"
                          data-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          Selection
                        </button>
                      </p>
                    </div>
                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        <div className="row">
                          <div className="col-4">
                            <div
                              className="media"
                              data-toggle="collapse"
                              data-target="#collapseTwo"
                              style={{ cursor: 'pointer' }}
                            >
                              <img
                                className="mr-3"
                                style={{ maxWidth: '64px' }}
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAn1BMVEX///9SlM8gW5kuc7hQks0paqw9gMEgXJoAUZRHj8260uqrvdQAZbL6/P4LVJYcWZhDjcwASpEATpNZmNGuyuadsczb5/TI2u4rYp1jntPAzd7x9vvO2OW4xtk7a6LF2e0LYqp1qNcqeb6itc+1z+g9baOGsdxVfKs4iMrn7/jf5u9ujbaYvOCCnL+Qt955lbvJ0+Jfg699rNoARI6OpcXaVDOdAAADm0lEQVR4nO3d2XLaMBhA4ZiqtR1qvAAJAUz2Qtambd7/2SqBIQbsYAuvmXNuk5H0RZMLxMV/ckJEREREREREdChnePXzUDcDp+5jaucMXev7t0P9sMWg7pNqNuxZnU4GoSFsu43GW1f6sgkNaWzdPUa+rEJp9Iy7ug+do+7al13YKmPX3PjyCJfG07oPn6GwY7kdPWErjOEoiPvyCpWxf1k34pNCc8eXX9hoYzjb8+kIlfGiicZxkk9PuDSe1w3aKcWnK2yccXyf4tMXNsvo+Gm+Y4TSuGjKpw6nV47QsBFWFUKECOsPIUKE9fdFhI9nqT+qQzh9KNg3/eN73vXgLHHLioWT6XDuB4u/6X/y/L3NA9dU77aenaSsUOi8vc97gdzPFcK7Lsq4ep0wV5tK5eLi+XxSg3Ayfr/3pW65mSsKe+3oRq9n5sfG6i7jygqEUjezgtg+Srh8tTry9VF9exStam5vHr/LkoUP4cvMD3b2WAmVURzx7dzk3fp4vTb3DyCVXv/1clKaUEjd71FgJay/FqpT2M+Tw5ikxn585QThRpkOPE5ozPwk3bZQ3fVC70Wna8WXTBEulaUJ0xfeEhq23n9jA4QmQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiLDVwn/xk6cKhbBLE6YPA9sSioXm9LXpPDZSPFEobNszft2VJuw+mb6VuHpMeNSYwOl8MxZ+T7jSnT6UOVlOHuGx+9QJLHd3h43w6DGIm3vcEqrJef3X02hSZunTAaVytDOBLRKKRQFjHqN73AjXE/M+fqOSCY87U/SWwsLGWKp7dM1kXWXCtTK6Syks5P4+jIFrSN3ufM6KharJ+GUWBD3XLm4M6drYT9RVLoyUo4J9n/dFJh5/EkKECOsPIUKE9YcQYQuEfjlCsWiK8GR8H6QZ9YXCu9CbmF5O41mKUVfYMJ8qxagnbKBPFSYZdYTSd1k3JqXQ3DPmFwqv31SfKhztGPMKG+5ThZ2tR+p8QuEZmu/zldY1LT1hS3yqrmvlF0rfXd0Hz9Ht2phV2DKfKjJmEwpbDOo+sEbDnpVNKGy7jT6ZM3StDMJ23l+UM7z6eaibQWM+QRARERERERFRg/sPWgsdm/HykUYAAAAASUVORK5CYII="
                                alt="RedShift"
                              />
                              <div className="media-body">
                                <Link
                                  to={`/configure-tap/?tap=${'tap-redshift'}&version=${'1.0'}`}
                                >
                                  <h5 className="mt-0">Redshift</h5>
                                </Link>
                                <a
                                  href="https://github.com/datadotworld/tap-redshift"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Learn more
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
