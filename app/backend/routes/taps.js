const router = require('express').Router();

const { getTaps, fetchTapFields } = require('../controllers/taps');

router.get('/', (req, res) => {
  getTaps()
    .then((taps) => res.json({ taps }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/', (req, res) => {
  console.log('Being called?');
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

module.exports = router;
