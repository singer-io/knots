const express = require('express');
const { taps } = require('../constants');

const router = express.Router();
const { detectDocker } = require('../util');

// define the home page route
router.get('/taps', (req, res) => {
  res.json(taps);
});

// define the about route
router.post('/taps/', (req, res) => {
  detectDocker()
    .then(() => {
      res.send('Seems you have Docker');
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

module.exports = router;
