const router = require('express').Router();

const { detectDocker } = require('../controllers/knots');

router.get('/docker', (req, res) => {
  detectDocker()
    .then((version) => {
      res.json({ version });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
