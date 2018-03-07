const express = require('express');
const { taps } = require('../constants');

const router = express.Router();
const { getKnots, detectDocker, installTap } = require('../util');

router.get('/knots/', (req, res) => {
  getKnots().then((knots) => res.json(knots));
});

router.get('/taps', (req, res) => {
  res.json(taps);
});

router.post('/taps/', (req, res) => {
  detectDocker()
    .then(() => {
      installTap().then(() =>
        res.json({
          docker: true,
          // Hard code fields for now
          config: [
            { key: 'host', label: 'Hostname', required: true },
            { key: 'user', label: 'User name', required: true },
            { key: 'password', label: 'Password', required: true },
            { key: 'dbname', label: 'Database', required: true },
            { key: 'port', label: 'Port', required: true },
            { key: 'schema', label: 'Schema', required: false }
          ]
        })
      );
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

module.exports = router;
