const router = require('express').Router();

const {
  getKnots,
  saveKnot,
  sync,
  deleteKnot,
  packageKnot,
  downloadKnot,
  partialSync,
  loadValues
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

router.post('/full-sync/', (req, res) => {
  sync(req)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/partial-sync/', (req, res) => {
  partialSync(req)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/load/', (req, res) => {
  const { knot } = req.body;
  loadValues(knot)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
