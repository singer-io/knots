// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router';
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Header from '../Header';

import styles from './Sync.css';

type Props = {
  knotsStore: {
    loading: boolean,
    synced: boolean,
    saved: boolean,
    syncLogs: string
  },
  userStore: {
    selectedDataset: string,
    datasets: Array<{ owner: string }>
  },
  location: { state: { knot: string } },
  sync: (knot: string) => void,
  saveKnot: (name: string) => Promise<string>
};

type State = {
  showSaveModal: boolean,
  knotName: string
};

export default class Sync extends Component<Props, State> {
  props: Props;
  constructor() {
    super();

    this.state = { showSaveModal: false, knotName: '' };
  }
  sync = () => {
    this.props.sync(this.props.location.state.knot);
  };

  showModal = () => {
    this.setState({ showSaveModal: true });
  };

  closeModal = () => {
    this.setState({ showSaveModal: false });
  };

  handleChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    this.setState({ knotName: value });
  };

  saveKnot = () => {
    this.props.saveKnot(this.state.knotName);
  };

  render() {
    if (this.props.knotsStore.saved) {
      return <Redirect push to="/" />;
    }

    return (
      <div>
        <Header>Redshift + data.world</Header>
        <div className={styles.syncBody}>
          <p>
            <span className={styles.emphasis}>Success! </span>
            Your pipeline is ready to be executed.
          </p>
          <div className={styles.syncKnot}>
            <div className={styles.toFro}>
              <img
                src="https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png"
                alt="tap logo"
                className={styles.tapLogo}
              />
              <span className={styles.to}>&gt;</span>
              <img
                src="https://assets.data.world/assets/jumping_sparkle.5ed7a6ee85ba4718f189bef76607d36d.svg"
                alt="target logo"
                className={styles.targetLogo}
              />
            </div>
            {!this.props.knotsStore.loading &&
              !this.props.knotsStore.synced && (
                <div className={styles.buttonContainer}>
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className={styles.syncButton}
                    onClick={this.sync}
                  >
                    Run
                  </Button>
                </div>
              )}
            {this.props.knotsStore.loading &&
              !this.props.knotsStore.synced && (
                <div className={styles.buttonContainer}>
                  <div className={styles.syncLoader} />{' '}
                  <Button bsSize="large" className={styles.syncButton}>
                    <div>
                      <ReactLoading
                        type="spin"
                        color="#4688f1"
                        height="40px"
                        width="40px"
                      />
                    </div>
                    <span className={styles.syncingText}>Running</span>
                  </Button>
                </div>
              )}
            {!this.props.knotsStore.loading &&
              this.props.knotsStore.synced && (
                <div className="synced">
                  <div className="button-container">
                    <a
                      href={`https://data.world/${
                        this.props.userStore.datasets[0].owner
                      }/${this.props.userStore.selectedDataset}`}
                      target="_blank"
                    >
                      <Button
                        bsStyle="primary"
                        bsSize="large"
                        className="synced-view"
                      >
                        View on data.world
                      </Button>
                    </a>
                    <Button
                      bsStyle="primary"
                      bsSize="large"
                      className="synced-save"
                      onClick={this.showModal}
                    >
                      Save Knot
                    </Button>
                  </div>
                </div>
              )}
          </div>
          <textarea
            name="live-sync-logs"
            className={styles.syncLogs}
            value={this.props.knotsStore.syncLogs}
          />
          <Modal show={this.state.showSaveModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Save Knot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup
                controlId="formBasicText"
                key="saveKnot"
                validationState={this.state.knotName ? 'success' : 'error'}
              >
                <div key="name">
                  <ControlLabel className="control-label">Name</ControlLabel>
                  <FormControl
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.knotName}
                  />
                </div>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <div className="buttons-container">
                <Button onClick={this.closeModal}>Close</Button>
                <Button
                  bsStyle="primary"
                  onClick={this.saveKnot}
                  disabled={!(this.state.knotName.length > 0)}
                  className="save-knot-button"
                >
                  {this.props.knotsStore.loading && (
                    <div className="saving-loader">
                      <ReactLoading
                        type="spin"
                        color="#fff"
                        height="20px"
                        width="20px"
                      />
                    </div>
                  )}
                  <span>Save Knot</span>
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
