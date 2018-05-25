const express = require('express');

const router = express.Router();
const { sync, saveKnot, getToken, partialSync } = require('./util');

router.post('/sync/', (req, res) => {
  sync(req)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json({ status: 500 });
    });
});

router.post('/sync/partial/', (req, res) => {
  partialSync(req)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json({ status: 500 });
    });
});

router.post('/save-knot/', (req, res) => {
  const { name } = req.body;
  saveKnot(name)
    .then(() => res.json({ all: 'good' }))
    .catch((err) => {
      console.log('This is the error', err);
    });
});

router.post('/token/', (req, res) => {
  const { knot } = req.body;

  getToken(knot)
    .then((token) => {
      res.json({ token });
    })
    .catch((error) => res.json({ error }));
});

module.exports = router;
