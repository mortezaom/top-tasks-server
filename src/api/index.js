const express = require('express');

const roadmaps = require('./roadmaps');
const verifyToken = require('./verifyToken')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});
router.use('/roadmaps', verifyToken, roadmaps);

module.exports = router;
