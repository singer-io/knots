const router = require('express').Router();

const { getTargets, addTarget, addTargetConfig } = require('../targets');

router.get('/', (req, res) => {
  getTargets()
    .then((targets) => res.json({ targets }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/', (req, res) => {
  addTargetConfig(req.body)
    .then(() => res.json({}))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/select', (req, res) => {
  addTarget(req.body)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
