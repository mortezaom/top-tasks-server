const express = require('express')
const mongoist = require('mongoist')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const verifyToken = require('./validateToken')

const router = express.Router()

const db = mongoist(process.env.MONGODB_URI)
const { users } = db

const saltRounds = 10

const schema = require('../schemas/user')

// register user
router.post('/register', async (req, res, next) => {
    try {
        const { body } = req
        const { error } = schema.validate(body)
        if (error) {
            console.log(error)
            return res.status(400).json({
                error: error.details[0].message,
            })
        }
        const { username, password } = body
        const user = await users.findOne({ username })
        if (user) {
            return res.status(400).json({
                error: 'Username already exists',
            })
        }
        const hash = await bcrypt.hash(password, saltRounds)
        const newUser = await users.insert({
            username,
            password: hash,
            createdAt: new Date().toISOString(),
        })
        delete newUser.password
        const token = generateToken(newUser)
        return res.json({
            ...newUser,
            token,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// login user
router.post('/login', async (req, res, next) => {
    console.log(users)
    try {
        const { body } = req
        console.log(body)
        const { error } = schema.validate(body)
        if (error) {
            console.log(error)
            return res.status(400).json({
                error: error.details[0].message,
            })
        }
        const { username, password } = body
        const newUser = await users.findOne({ username })
        console.log(newUser)
        if (!newUser) {
            return res.status(400).json({
                error: 'Username does not exist',
            })
        }
        const isValid = await bcrypt.compare(password, newUser.password)
        if (!isValid) {
            return res.status(400).json({
                error: 'Invalid password',
            })
        }
        delete newUser.password
        const token = generateToken(newUser)
        return res.json({
            ...newUser,
            token,
        })
    } catch (error) {
        next(error)
    }
})

// change user password
router.put('/changePass', verifyToken, async (req, res, next) => {
    try {
        console.log(req.body)
        const body = req.body
        if (!body.oldPass || !body.newPass || body.oldPass == '' || body.newPass == '') {
            return res.status(400).json({
                error: "Invalid request body",
            })
        }

        const { oldPass, newPass } = body
        const user = await users.findOne({ _id: mongoist.ObjectId(req.user._id) })
        if (!user) {
            console.log('Username does not exist')
            return res.status(400).json({
                error: 'Username does not exist',
            })
        }
        const isValid = await bcrypt.compare(oldPass, user.password)
        if (!isValid) {
            console.log('Invalid password')
            return res.status(400).json({
                error: 'Invalid password',
            })
        }
        const hash = await bcrypt.hash(newPass, saltRounds)
        const newUser = await users.update({
            _id: user._id,
        }, {
            $set: {
                password: hash,
            },
        })
        delete newUser.password
        const token = generateToken(newUser)
        return res.json({
            ...newUser,
            token,
        })
    }
    catch (error) {
        next(error)
    }
})

function generateToken(data) {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}

module.exports = router