import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Header from '../Header';

import './Sync.css';

class Sync extends Component {
  constructor() {
    super();
    this.state = { showSaveModal: false, knotName: '' };

    this.sync = this.sync.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveKnot = this.saveKnot.bind(this);
  }

  sync() {
    this.props.knotsStore.sync();
  }

  showModal() {
    this.setState({ showSaveModal: true });
  }

  closeModal() {
    this.setState({ showSaveModal: false });
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ knotName: value });
  }

  saveKnot() {
    this.props.knotsStore.saveKnot(this.state.knotName).then(() => {
      window.location = 'http://localhost:3000';
    });
  }

  render() {
    return (
      <div className="Connect">
        <Header>Redshift + data.world</Header>
        <div className="sync-body">
          <p>
            <span className="emphasis">Success! </span>
            Your pipeline is ready to be executed.
          </p>
          <div className="sync-knot">
            <div className="to-fro">
              <img
                src="https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png"
                alt="tap logo"
                className="tap-logo"
              />
              <span className="to">&gt;</span>
              <img
                src="https://assets.data.world/assets/jumping_sparkle.5ed7a6ee85ba4718f189bef76607d36d.svg"
                alt="target logo"
                className="target-logo"
              />
            </div>
            {!this.props.knotsStore.loading &&
              this.props.knotsStore.synced && (
                <div className="button-container">
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    className="sync-button"
                    onClick={this.sync}
                  >
                    Run
                  </Button>
                </div>
              )}
            {!this.props.knotsStore.loading &&
              !this.props.knotsStore.synced && (
                <div className="synced">
                  <div className="button-container">
                    <a
                      href={`https://data.world/${
                        this.props.userStore.dataset.owner
                      }/${this.props.userStore.dataset.id}`}
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
              <div className="button-container">
                <div className="sync-loader" />{' '}
                <Button bsSize="large" className="sync-button">
                  <div>
                    <ReactLoading
                      type="spin"
                      color="#4688f1"
                      height="40px"
                      width="40px"
                    />
                  </div>
                  <span className="syncing-text">Running</span>
                </Button>
              </div>
            )}
          </div>
          <textarea
            name="live-sync-logs"
            className="live-sync-logs"
            value={this.props.knotsStore.syncLogs}
          />
        </div>
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
    );
  }
}

Sync.propTypes = {
  knotsStore: PropTypes.shape({
    sync: PropTypes.func.isRequired,
    syncLogs: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    synced: PropTypes.bool.isRequired,
    saveKnot: PropTypes.func.isRequired
  }).isRequired,
  userStore: PropTypes.shape({
    dataset: PropTypes.shape({
      owner: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default inject('knotsStore', 'userStore')(observer(Sync));
