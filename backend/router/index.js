const express = require('express');
const { taps } = require('../constants');

const router = express.Router();

// define the home page route
router.get('/taps', (req, res) => {
  res.json(taps);
});
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

module.exports = router;
