const express = require('express');

const router = express.Router();
const {
  getKnots,
  getTaps,
  detectDocker,
  addTap,
  addSchema,
  readSchema,
  writeSchema
} = require('./util');

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
        .then((config) =>
          res.json({
            dockerVersion,
            config
          })
        )
        .catch(() => {
          res.json({
            config: null
          });
        });
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

router.post('/tap/schema/', (req, res) => {
  addSchema(req.body.config)
    .then((schema) => {
      res.json(schema.streams);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/schema/', (req, res) => {
  readSchema()
    .then((schema) => res.json(schema.streams))
    .catch((err) => {
      res.json(err);
    });
});

router.put('/schema/', (req, res) => {
  writeSchema(req.body)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
