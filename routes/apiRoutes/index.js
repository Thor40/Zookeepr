const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);
// middleware so that the router uses the new zookeeper routes
router.use(require('./zookeeperRoutes'));

module.exports = router;