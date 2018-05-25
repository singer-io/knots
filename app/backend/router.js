const express = require('express');

const router = express.Router();
const {
  sync,
  saveKnot,
  downloadKnot,
  getToken,
  deleteKnot,
  partialSync
} = require('./util');

router.post('/save/', (req, res) => {
  const { knotName } = req.body;
  saveKnot(knotName)
    .then(() => {
      sync(req)
        .then(() => {
          res.json({ status: 200 });
        })
        .catch((error) => {
          res.json({ status: 500, error });
        });
    })
    .catch(() => {
      res.json({ status: 500 });
    });
});

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

router.post('/delete/', (req, res) => {
  const { knot } = req.body;
  deleteKnot(knot)
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

router.post('/download/', (req, res) => {
  const { knot } = req.body;
  downloadKnot(knot)
    .then(() => res.json({}))
    .catch();
});

router.post('/token/', (req, res) => {
  const { knot } = req.body;

  getToken(knot)
    .then((token) => {
      res.json({ token });
    })
    .catch((error) => res.json({ error }));
});

router.post('/download/', (req, res) => {
  const { knot } = req.body;
  downloadKnot(knot)
    .then(() => res.json({}))
    .catch();
});

router.get('/download/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download(`${req.query.knot}.zip`);
});

module.exports = router;
