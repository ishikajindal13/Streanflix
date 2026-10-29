const express = require('express')
const router = express.Router()

const Movie = require('../models/Movie')
const User = require('../models/User')
const mongoose = require('mongoose')
const authenticateToken = require('../middleware/authMiddleware')

router.post('/:movieId', authenticateToken, async (req, res) => {
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

router.get('/', authenticateToken, async (req, res) => {
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

router.delete('/:movieId', authenticateToken, async (req, res) => {
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

module.exports = router