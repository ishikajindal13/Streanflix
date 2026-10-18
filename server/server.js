const Movie = require('./models/Movie')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

require('dotenv').config()

const connectDB = require('./db')

const app = express()
app.use(cors())
const PORT = 5000

// API endpoint

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find()
    res.json(movies)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch movies',
    })
  }
})


app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      })
    }
    res.json(movie)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch movie',
    })
  }
})


app.use(express.json())

app.post('/api/movies', async (req, res) => {
  try {
    const movie = await Movie.create(req.body)

    res.status(201).json(movie)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})


app.patch('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      })
    }

    res.json(movie)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})


app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(
      req.params.id
    )

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      })
    }

    res.json({
      message: 'Movie deleted successfully',
      movie,
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})


app.post('/api/auth/register', async (req, res) => {
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


app.post('/api/auth/login', async (req, res) => {
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
    res.json({
      message: 'Login successful',
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


// Start server
async function startServer() {
  await connectDB()

  app.listen(process.env.PORT || 5000, () => {
    console.log('StreamFlix server is running')
  })
}

startServer()