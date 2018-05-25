const dockerRoutes = require('./docker');
const knotsRoutes = require('./knots');
const tapsRoutes = require('./taps');

const router = (app) => {
  app.use('/docker', dockerRoutes);
  app.use('/knots', knotsRoutes);
  app.use('/taps', tapsRoutes);
};

module.exports = router;
