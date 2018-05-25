const dockerRoutes = require('./docker');
const knotsRoutes = require('./knots');
const tapsRoutes = require('./taps');
const targetsRoutes = require('./targets');

const router = (app) => {
  app.use('/docker', dockerRoutes);
  app.use('/knots', knotsRoutes);
  app.use('/taps', tapsRoutes);
  app.use('/targets', targetsRoutes);
};

module.exports = router;
