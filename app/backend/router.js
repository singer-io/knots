const express = require('express');

const router = express.Router();
const { getKnots } = require('./util');

router.get('/', (req, res) => res.send('Server running'));

router.get('/knots', (req, res) => {
  getKnots()
    .then((knots) => res.json(knots))
    .catch(() => {
      res.json([]);
    });
});

module.exports = router;
