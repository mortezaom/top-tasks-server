const express = require('express');
const mongoist = require('mongoist')
const router = express.Router();

const db = mongoist(process.env.MONGODB_URI);
const { roadmaps } = db;

const schema = require('../schemas/roadmap');

router.get('/', async (req, res, next) => {
  try {
    const items = await roadmaps.find({ id: '5c8f8f8f8f8f8f8f8f8f8f8f' });
    res.json(items).end();
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(JSON.parse(req.body));
    const item = await roadmaps.insert(value);
    res.json(item).status(200).end();
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(JSON.parse(req.body));
    const item = await roadmaps.update({ id: req.params.id }, value);
    res.json(item).status(200).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
