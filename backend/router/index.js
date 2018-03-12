const express = require('express');
const { taps, targets } = require('../constants');

const router = express.Router();
const {
  getKnots,
  detectDocker,
  addTap,
  addSchema,
  addTarget
} = require('../util');

router.get('/knots/', (req, res) => {
  getKnots().then((knots) => res.json(knots));
});

router.get('/taps', (req, res) => {
  res.json(taps);
});

router.post('/taps/', (req, res) => {
  detectDocker()
    .then(() => {
      const { tap, version } = req.body;
      addTap(tap, version).then((config) =>
        res.json({
          docker: true,
          config
        })
      );
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

router.post('/tap/schema/', (req, res) => {
  addSchema(req.body)
    .then((schema) => {
      res.json(schema.streams);
    })
    .catch((err) => {
      console.log('This is the error', err);
    });
});

router.get('/targets', (req, res) => {
  res.json(targets);
});

router.post('/targets', (req, res) => {
  const { target, version } = req.body;
  console.log(target, version);
  addTarget(target, version).then(() =>
    res.json({
      docker: true
    })
  );
});

module.exports = router;
