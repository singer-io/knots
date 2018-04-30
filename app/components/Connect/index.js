// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card } from 'reactstrap';

import Header from '../Header';
import Loader from '../Loader';
import KnotProgress from '../../containers/KnotProgress';
import ConnectForm from './ConnectForm';
import Modals from './Modal';

type Props = {
  tapsStore: {
    schema: Array<{}>,
    tapsLoading: boolean,
    tapFields: Array<{
      key: string,
      label: string
    }>,
    fieldValues: {},
    error: string,
    showModal: boolean,
    liveLogs: string,
    syntaxError: boolean
  },
  toggle: () => void,
  updateTapField: (key: string, value: string) => void,
  submitConfig: (fieldValues: {}) => void,
  discoveryLiveLogs: () => void,
  history: { goback: () => void }
};

export default class Taps extends Component<Props> {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.props.discoveryLiveLogs();
  }

  toggle() {
    this.props.toggle();
  }

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const { name, value } = event.currentTarget;
    this.props.updateTapField(name, value);
  };

  submit = () => {
    this.props.submitConfig(this.props.tapsStore.fieldValues);
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      tapsLoading,
      schema,
      error,
      showModal,
      liveLogs,
      syntaxError
    } = this.props.tapsStore;

    if (schema.length > 0) {
      return <Redirect push to="/schema" />;
    }

    return (
      <div>
        <Header />
        {tapsLoading && (
          <div>
            <Loader />
            <Card
              style={{ height: '340px', maxWidth: '50%', margin: '0 auto' }}
              className="bg-light mt-3"
            >
              <pre
                style={{ height: '340px' }}
                className="pre-scrollable text-muted"
              >
                {liveLogs}
              </pre>
            </Card>
            <Button color="primary" className="float-right mt-3">
              Continue
            </Button>
            {error &&
              !syntaxError && (
                <Modals
                  showModal={showModal}
                  toggle={() => this.toggle()}
                  headerText="Tap error"
                  body="Unable to execute tap in discovery mode."
                  error={error}
                  reconfigure={() => this.goBack()}
                />
              )}
            {syntaxError && (
              <Modals
                showModal={showModal}
                toggle={() => this.toggle()}
                headerText="Invalid schema"
                body="Tap generated an invalid schema."
                error={error}
                reconfigure={() => this.goBack()}
              />
            )}
          </div>
        )}
        {!tapsLoading && <KnotProgress />}
        {!tapsLoading && (
          <ConnectForm
            fields={this.props.tapsStore.tapFields}
            handleChange={this.handleChange}
            submit={this.submit}
          />
        )}
      </div>
    );
  }
}
