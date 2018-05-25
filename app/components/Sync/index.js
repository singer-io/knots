// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert
} from 'reactstrap';
import StayScrolled from 'react-stay-scrolled';
import classNames from 'classnames';
import socketIOClient from 'socket.io-client';
import queryString from 'query-string';

import Header from '../Header';
import KnotProgress from '../../containers/KnotProgress';
import Log from '../Log';

import styles from './Sync.css';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

type Props = {
  knotsStore: {
    knotName: string,
    knotSyncing: boolean,
    knotSynced: boolean,
    tapLogs: Array<string>,
    targetLogs: Array<string>,
    knotError: string
  },
  tapStore: {
    selectedTap: { name: string, image: string }
  },
  targetsStore: {
    selectedTarget: { name: string, image: string }
  },
  updateName: (name: string) => void,
  save: (
    knotName: string,
    selectedTap: { name: string, image: string },
    selectedTarget: { name: string, image: string }
  ) => void,
  updateTapLogs: (log: string) => void,
  updateTargetLogs: (log: string) => void,
  location: { search: string },
  sync: (knot: string) => void,
  partialSync: (knot: string) => void
};

export default class Sync extends Component<Props> {
  constructor() {
    super();

    socket.on('tapLog', (log) => {
      this.props.updateTapLogs(log);
    });

    socket.on('targetLog', (log) => {
      this.props.updateTargetLogs(log);
    });
  }

  componentWillMount() {
    const { knot, mode } = queryString.parse(this.props.location.search);
    if (mode === 'full') {
      this.props.sync(knot);
    } else if (mode === 'partial') {
      this.props.partialSync(knot);
    }
  }

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;

    this.props.updateName(value);
  };

  submit = () => {
    const { selectedTap } = this.props.tapStore;
    const { selectedTarget } = this.props.targetsStore;
    const { knotName } = this.props.knotsStore;
    this.props.save(knotName, selectedTap, selectedTarget);
  };

  terminateProcess = () => {
    socket.emit('terminate', 'sync');
  };

  render() {
    const {
      knotSyncing,
      knotSynced,
      knotName,
      tapLogs,
      targetLogs,
      knotError
    } = this.props.knotsStore;
    const { selectedTap } = this.props.tapStore;
    const { selectedTarget } = this.props.targetsStore;

    return (
      <div>
        <Header />
        <Container>
          <KnotProgress />
          <h2 className="mb-1 pt-4">Save & Run</h2>
          <Alert
            isOpen={!!knotError}
            color="danger"
            className="d-flex justify-content-between"
          >
            <span className="align-self-center">{knotError}</span>
          </Alert>
          <Row>
            {!knotSyncing &&
              !knotSynced &&
              !knotError && (
                <Col xs="12">
                  <Form className={styles.form}>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText className={styles.logos}>
                          <img
                            alt="Redshift logo"
                            className={styles.logo}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAn1BMVEX///9SlM8gW5kuc7hQks0paqw9gMEgXJoAUZRHj8260uqrvdQAZbL6/P4LVJYcWZhDjcwASpEATpNZmNGuyuadsczb5/TI2u4rYp1jntPAzd7x9vvO2OW4xtk7a6LF2e0LYqp1qNcqeb6itc+1z+g9baOGsdxVfKs4iMrn7/jf5u9ujbaYvOCCnL+Qt955lbvJ0+Jfg699rNoARI6OpcXaVDOdAAADm0lEQVR4nO3d2XLaMBhA4ZiqtR1qvAAJAUz2Qtambd7/2SqBIQbsYAuvmXNuk5H0RZMLxMV/ckJEREREREREdChnePXzUDcDp+5jaucMXev7t0P9sMWg7pNqNuxZnU4GoSFsu43GW1f6sgkNaWzdPUa+rEJp9Iy7ug+do+7al13YKmPX3PjyCJfG07oPn6GwY7kdPWErjOEoiPvyCpWxf1k34pNCc8eXX9hoYzjb8+kIlfGiicZxkk9PuDSe1w3aKcWnK2yccXyf4tMXNsvo+Gm+Y4TSuGjKpw6nV47QsBFWFUKECOsPIUKE9fdFhI9nqT+qQzh9KNg3/eN73vXgLHHLioWT6XDuB4u/6X/y/L3NA9dU77aenaSsUOi8vc97gdzPFcK7Lsq4ep0wV5tK5eLi+XxSg3Ayfr/3pW65mSsKe+3oRq9n5sfG6i7jygqEUjezgtg+Srh8tTry9VF9exStam5vHr/LkoUP4cvMD3b2WAmVURzx7dzk3fp4vTb3DyCVXv/1clKaUEjd71FgJay/FqpT2M+Tw5ikxn585QThRpkOPE5ozPwk3bZQ3fVC70Wna8WXTBEulaUJ0xfeEhq23n9jA4QmQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiLDVwn/xk6cKhbBLE6YPA9sSioXm9LXpPDZSPFEobNszft2VJuw+mb6VuHpMeNSYwOl8MxZ+T7jSnT6UOVlOHuGx+9QJLHd3h43w6DGIm3vcEqrJef3X02hSZunTAaVytDOBLRKKRQFjHqN73AjXE/M+fqOSCY87U/SWwsLGWKp7dM1kXWXCtTK6Syks5P4+jIFrSN3ufM6KharJ+GUWBD3XLm4M6drYT9RVLoyUo4J9n/dFJh5/EkKECOsPIUKE9YcQYQuEfjlCsWiK8GR8H6QZ9YXCu9CbmF5O41mKUVfYMJ8qxagnbKBPFSYZdYTSd1k3JqXQ3DPmFwqv31SfKhztGPMKG+5ThZ2tR+p8QuEZmu/zldY1LT1hS3yqrmvlF0rfXd0Hz9Ht2phV2DKfKjJmEwpbDOo+sEbDnpVNKGy7jT6ZM3StDMJ23l+UM7z6eaibQWM+QRARERERERFRg/sPWgsdm/HykUYAAAAASUVORK5CYII="
                          />
                          <span className="oi oi-chevron-right px-2" />
                          <img
                            alt="Data World logo"
                            className={styles.logo}
                            src="data:image/png;base64,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 "
                          />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Untitled knot"
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                    <Button
                      color="primary"
                      className="float-right mt-2"
                      disabled={!this.props.knotsStore.knotName}
                      onClick={this.submit}
                    >
                      Save & Run
                    </Button>
                  </Form>
                </Col>
              )}
            {knotSyncing && (
              <Col xs="12">
                <div className="alert alert-success" style={{ width: '100%' }}>
                  <strong className="">{`${knotName} has been saved! Running your knot could take a while...`}</strong>
                </div>
              </Col>
            )}

            {knotSynced &&
              !knotError && (
                <Col xs="12">
                  <div
                    className="alert alert-success"
                    style={{ width: '100%' }}
                  >
                    <strong>{`${knotName} has been run successfully`}</strong>
                  </div>
                </Col>
              )}
          </Row>
          <Row>
            <Col sm="6">
              <Card className="bg-light mt-3">
                <CardHeader>
                  <h3 className="pl-5">{selectedTap.name}</h3>
                </CardHeader>
                <CardBody>
                  <StayScrolled
                    component="div"
                    style={{
                      height: '250px',
                      overflow: 'auto'
                    }}
                  >
                    {tapLogs.map((log) => <Log key={log} log={log} />)}
                  </StayScrolled>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="bg-light mt-3">
                <CardHeader>
                  <h3 className={classNames('pl-5')}>{selectedTarget.name}</h3>
                </CardHeader>
                <CardBody>
                  <StayScrolled
                    component="div"
                    style={{
                      height: '250px',
                      overflow: 'auto'
                    }}
                  >
                    {targetLogs.map((log) => <Log key={log} log={log} />)}
                  </StayScrolled>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {!knotSynced &&
            !knotError && (
              <Button
                onClick={this.terminateProcess}
                className={classNames(
                  'btn btn-outline-danger float-right my-3',
                  styles.cancelProcess
                )}
              >
                Cancel
              </Button>
            )}
          {knotSynced &&
            !knotError && (
              <Link to="/">
                <Button
                  color="primary"
                  className="float-right my-3"
                  onClick={this.submit}
                >
                  Done
                </Button>
              </Link>
            )}
        </Container>
      </div>
    );
  }
}
