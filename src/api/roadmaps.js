const express = require('express');
const mongoist = require('mongoist')
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

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
    const data = JSON.parse(req.body.data);
    data.userId = req.user._id;
    data.items = data.items.map(item => { return { _id: mongoist.ObjectId().toString(), name: item.name, videos: item.videos, learnTime: item.learnTime } });
    const value = await schema.validateAsync(data);
    const item = await roadmaps.insert(value);
    res.json(item).status(200).end();
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(JSON.parse(req.body['data']));
    console.log(value)
    await roadmaps.remove({ _id: mongoist.ObjectId(req.params.id) });
    value._id = mongoist.ObjectId(req.params.id);
    const item = await roadmaps.insert(value, { forceServerObjectId: false });
    console.log(item)
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
