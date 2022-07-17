const express = require('express');
const mongoist = require('mongoist');
const verifyToken = require('./validateToken');
const router = express.Router();

const db = mongoist(process.env.MONGODB_URI);
const { reports } = db;

router.post('/', async (req, res, next) => {
    try {
        const data = { text: req.body.text, userId: req.user._id, createdAt: Date.now().toString() }
        await reports.insert(data)
        res.json({ msg: 'Done' }).status(200).end()
    } catch (error) {
        console.log(error)
        next(error);
    }
});
module.exports = router;
