const express = require('express');

const router = express.Router();
const { getKnots, getTaps, detectDocker, addTap } = require('./util');

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

router.post('/taps/', (req, res) => {
  detectDocker()
    .then((dockerVersion) => {
      const { tap, version } = req.body;
      addTap(tap, version)
        .then((config) => {
          console.log('This is the result', config);
          return res.json({
            dockerVersion,
            config
          });
        })
        .catch((err) => {
          console.log('This is the error', err);
          res.json({
            config: null
          });
        });
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

module.exports = router;
