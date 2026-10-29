const express = require('express')
const router = express.Router()

const User = require('../models/User')
const authenticateToken = require('../middleware/authMiddleware')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check that both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    // Check whether the email already exists
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered',
      })
    }

    // Convert the password into a secure hash
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save the new user in MongoDB
    const user = await User.create({
      email,
      password: hashedPassword,
    })

    // Never send the password hash to the frontend
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    // Find the registered user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Compare entered password with saved hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Return safe user information


const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
)
    res.json({
      message: 'Login successful',
       token,
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
    })
  }
})

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'User no longer exists',
      })
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user',
    })
  }
})

module.exports = router