// @flow

import React, { Component } from 'react';
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import Header from '../Header';

import styles from './Sync.css';

type Props = {
  knotsStore: {
    loading: boolean,
    synced: boolean,
    showSaveModal: boolean,
    knotName: string
  },
  sync: () => void,
  showModal: () => void,
  closeModal: () => void,
  setKnotName: () => void,
  saveKnot: () => void
};

export default class Sync extends Component<Props> {
  props: Props;
  showModal = () => {
    this.props.showModal();
  };

  closeModal = () => {
    this.props.closeModal();
  };

  handleChange = (e) => {
    const { value } = e.target;
    console.log(value);
    this.props.setKnotName(value);
  };

  saveKnot = () => {
    this.props
      .saveKnot(this.props.knotsStore.knotName)
      .then(() => {
        window.location = 'http://localhost:3000';
      })
      .catch();
  };

  sync = () => {
    this.props.sync();
  };

  render() {
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
            {!this.props.knotsStore.loading &&
              this.props.knotsStore.synced && (
                <div className="synced">
                  <div className="button-container">
                    <a href="ok" target="_blank">
                      <Button
                        bsStyle="primary"
                        bsSize="large"
                        className="synced-view"
                      >
                        View on data.world
                      </Button>
                    </a>
                  </div>
                  <div className="button-container">
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
            {this.props.knotsStore.loading && (
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
          </div>
          <textarea name="live-sync-logs" className="live-sync-logs" />
        </div>
        <Modal
          show={this.props.knotsStore.showSaveModal}
          onHide={this.closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Save Knot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup
              controlId="formBasicText"
              key="saveKnot"
              validationState={
                this.props.knotsStore.knotName ? 'success' : 'error'
              }
            >
              <div key="name">
                <ControlLabel className="control-label">Name</ControlLabel>
                <FormControl
                  type="text"
                  onChange={this.handleChange}
                  value={this.props.knotsStore.knotName}
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
                disabled={!(this.props.knotsStore.knotName.length > 0)}
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
    );
  }
}
