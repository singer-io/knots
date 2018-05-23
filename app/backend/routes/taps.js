const router = require('express').Router();

const {
  getTaps,
  fetchTapFields,
  addConfig,
  writeSchema
} = require('../controllers/taps');

router.get('/', (req, res) => {
  getTaps()
    .then((taps) => res.json({ taps }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/select', (req, res) => {
  const { tap } = req.body;
  fetchTapFields(tap.name, tap.image)
    .then((config) => {
      res.json({
        config
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/config/', (req, res) => {
  addConfig(req)
    .then((schema) => res.json({ schema: schema.streams }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.put('/schema/', (req, res) => {
  writeSchema(req.body)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
