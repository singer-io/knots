const router = require('express').Router();

const { getKnots, saveKnot } = require('../knots');

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
      res.json({});
      // sync(req)
      //   .then(() => {
      //     res.json({ status: 200 });
      //   })
      //   .catch((error) => {
      //     res.json({ status: 500, error });
      //   });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
