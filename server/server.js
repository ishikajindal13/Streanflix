const Movie = require('./models/Movie')
const User = require('./models/User')

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = require('./db')

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 5000


function authenticateToken(req, res, next) {
  // Read the Authorization header
  const authHeader = req.headers.authorization

  // Extract the token from "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      message: 'Access token required',
    })
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      })
    }

    // Make the token's payload available to the next handler
    req.user = user

    next()
  })
}


// API endpoint

app.get('/api/movies', async (req, res) => {
  try {
const page = Math.max(1, Number(req.query.page) || 1)

const limit = Math.min(
  50,
  Math.max(1, Number(req.query.limit) || 10)
)

const skip = (page - 1) * limit
const filter = {}

if (req.query.genre) {
  filter.genre = req.query.genre
}
const totalMovies = await Movie.countDocuments(filter)
const totalPages = Math.ceil(totalMovies / limit)
const sortBy = req.query.sortBy
const order = req.query.order === 'asc' ? 1 : -1

const sort = {}

if (sortBy === 'rating' || sortBy === 'year') {
  sort[sortBy] = order
}

const movies = await Movie.find(filter)
  .sort(sort)
  .skip(skip)
  .limit(limit)
    res.json({
  movies,
  totalMovies,
  totalPages,
  currentPage: page,
})
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



app.post('/api/movies', async (req, res) => {
  try {

    if (!req.body.title || !req.body.title.trim()) {
  return res.status(400).json({
    message: 'Movie title is required',
  })
}

if (!req.body.poster || !req.body.poster.trim()) {
  return res.status(400).json({
    message: 'Movie poster is required',
  })
}

if (!req.body.genre || !req.body.genre.trim()) {
  return res.status(400).json({
    message: 'Movie genre is required',
  })
}
if (
  req.body.year === undefined ||
  req.body.year === null ||
  !Number.isInteger(Number(req.body.year)) ||
  Number(req.body.year) < 1888
) {
  return res.status(400).json({
    message: 'A valid movie year is required',
  })
}
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


app.get('/api/auth/me', authenticateToken, async (req, res) => {
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


app.post('/api/my-list/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params

    // Step 1: Validate the movie ID
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        message: 'Invalid movie ID',
      })
    }

    // Step 2: Check whether the movie exists
    const movie = await Movie.findById(movieId)

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      })
    }

    // Step 3: Find the logged-in user
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // Step 4: Check whether the movie is already saved
    const alreadyAdded = user.myList.some(
      (savedMovieId) => savedMovieId.toString() === movieId
    )

    if (alreadyAdded) {
      return res.json({
        message: 'Movie is already in My List',
        alreadyAdded: true,
      })
    }

    // Step 5: Add the movie to My List
    user.myList.push(movieId)
    await user.save()

    // Step 6: Send the success response
    res.json({
      message: 'Movie added to My List',
      alreadyAdded: false,
      myList: user.myList,
    })
  } catch (error) {
    console.error('Add to My List error:', error)

    res.status(500).json({
      message: 'Failed to add movie to My List',
    })
  }
})


app.get('/api/my-list', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('myList')
      .select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json(user.myList)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch My List',
    })
  }
})


app.delete('/api/my-list/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        message: 'Invalid movie ID',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { myList: movieId } },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json({
      message: 'Movie removed from My List',
      myList: user.myList,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to remove movie from My List',
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