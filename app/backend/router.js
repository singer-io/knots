const express = require('express');

const router = express.Router();
const { getKnots, getTaps } = require('./util');

router.get('/', (req, res) => res.send('Server running'));

router.get('/knots', (req, res) => {
  getKnots()
    .then((knots) => res.json(knots))
    .catch(() => {
      res.json([]);
    });
});

router.get('/taps', (req, res) => {
  getTaps()
    .then((taps) => res.json(taps))
    .catch(() => {
      res.json([]);
    });
});

module.exports = router;
