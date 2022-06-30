const express = require('express')
const mongoist = require('mongoist')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
    try {
        const { body } = req
        const { error } = schema.validate(body)
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            })
        }
        const { username, password } = body
        const user = await users.findOne({ username })
        if (!user) {
            return res.status(400).json({
                error: 'Username does not exist',
            })
        }
        const isValid = await bcrypt.compare(password, user.password)
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
router.post('/change-password', async (req, res, next) => {
    try {
        const { body } = req
        const { error } = schema.validate(body)
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            })
        }
        const { username, oldPassword, newPassword } = body
        const user = await users.findOne({ username })
        if (!user) {
            return res.status(400).json({
                error: 'Username does not exist',
            })
        }
        const isValid = await bcrypt.compare(oldPassword, user.password)
        if (!isValid) {
            return res.status(400).json({
                error: 'Invalid password',
            })
        }
        const hash = await bcrypt.hash(newPassword, saltRounds)
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