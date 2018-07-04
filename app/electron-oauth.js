import { stringify } from 'querystring';
import { OAuth2Client } from 'google-auth-library';

const fetch = require('node-fetch');
const co = require('co');
// eslint-disable-next-line import/no-extraneous-dependencies
const { BrowserWindow } = require('electron');
const nodeUrl = require('url');

/* eslint-disable camelcase */

const getAuthenticationUrl = (
  scopes,
  clientId,
  clientSecret,
  redirectUri,
  authBaseUrl
) => {
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  oauth2Client.authBaseUrl = authBaseUrl;
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  return url;
};

const authorizeApp = (url, browserWindowParams) =>
  new Promise((resolve, reject) => {
    const win = new BrowserWindow(
      browserWindowParams || { 'use-content-size': true }
    );

    win.loadURL(url);

    win.on('closed', () => {
      reject(new Error('User closed the window'));
    });

    function onCallback(uri) {
      const url_parts = nodeUrl.parse(uri, true);
      const { query } = url_parts;
      const { code, error } = query;

      if (error !== undefined) {
        reject(error);
        win.removeAllListeners('closed');
        setImmediate(() => {
          win.close();
        });
      } else if (code) {
        resolve(code);
        win.removeAllListeners('closed');
        setImmediate(() => {
          win.close();
        });
      }
    }

    win.webContents.on('will-navigate', (event, urlString) => {
      onCallback(urlString);
    });

    win.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      onCallback(newUrl);
    });

    win.on('page-title-updated', () => {
      setImmediate(() => {
        const title = win.getTitle();
        if (title.startsWith('Denied')) {
          reject(new Error(title.split(/[ =]/)[2]));
          win.removeAllListeners('closed');
          win.close();
        } else if (title.startsWith('Success')) {
          resolve(title.split(/[ =]/)[2]);
          win.removeAllListeners('closed');
          win.close();
        }
      });
    });
  });

// $FlowFixMe
// eslint-disable-next-line import/prefer-default-export
export function electronOauth(browserWindowParams, httpAgent) {
  const getAuthorizationCode = (
    scopes,
    clientId,
    clientSecret,
    redirectUri,
    authBaseUrl
  ) => {
    const url = getAuthenticationUrl(
      scopes,
      clientId,
      clientSecret,
      redirectUri,
      authBaseUrl
    );
    return authorizeApp(url, browserWindowParams);
  };

  /* eslint func-names: ["error", "never"] */
  const getAccessToken = co.wrap(function*(
    scopes,
    clientId,
    clientSecret,
    redirectUri,
    tokenUrl,
    authBaseUrl
  ) {
    const authorizationCode = yield getAuthorizationCode(
      scopes,
      clientId,
      clientSecret,
      redirectUri,
      authBaseUrl
    );
    const data = stringify({
      code: authorizationCode,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const res = yield fetch(tokenUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data,
      agent: httpAgent
    });
    return yield res.json();
  });

  return { getAuthorizationCode, getAccessToken };
}
