const knotsRoutes = require('./knots');
const tapsRoutes = require('./taps');

const router = (app) => {
  app.use('/knots', knotsRoutes);
  app.use('/taps', tapsRoutes);
};

module.exports = router;
