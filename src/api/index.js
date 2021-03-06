const express = require('express');

const roadmaps = require('./roadmaps');
const reports = require('./reports');
const users = require('./users');
const verifyToken = require('./validateToken')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API'
  });
});
router.use('/roadmaps', verifyToken, roadmaps);
router.use('/reports', verifyToken, reports);
router.use('/auth', users);

module.exports = router;
