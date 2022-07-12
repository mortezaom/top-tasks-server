const express = require('express');
const mongoist = require('mongoist')
const router = express.Router();

const db = mongoist(process.env.MONGODB_URI);
const { roadmaps } = db;

const schema = require('../schemas/roadmap');

router.get('/', async (req, res, next) => {
  try {
    const items = await roadmaps.find({});
    res.json(items).end();
  } catch (error) {
    next(error);
  }
});

router.get('/my', async (req, res, next) => {
  try {
    console.log(req.user._id)
    const items = await roadmaps.find({ userId: req.user._id });
    console.log(items)
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
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = JSON.parse(req.body)
    const item = await roadmaps.delete({ id });
    res.json(item).status(200).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
