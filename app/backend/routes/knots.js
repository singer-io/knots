const router = require('express').Router();

const {
  getKnots,
  saveKnot,
  sync,
  deleteKnot,
  packageKnot,
  downloadKnot
} = require('../knots');

router.get('/', (req, res) => {
  getKnots()
    .then((knots) => res.json({ knots }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/save/', (req, res) => {
  const { knotName } = req.body;
  saveKnot(knotName)
    .then(() => {
      sync(req)
        .then(() => {
          res.json({});
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/delete/', (req, res) => {
  const { knot } = req.body;
  deleteKnot(knot)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/download/', (req, res) => {
  const { knot } = req.body;
  packageKnot(knot)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.get('/download/', (req, res) => {
  downloadKnot(req, res);
});

module.exports = router;
