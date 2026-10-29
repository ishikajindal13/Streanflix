const express = require('express')
const router = express.Router()
const Movie = require('../models/Movie')

router.get('/api/movies', async (req, res) => {
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

router.get('/api/movies/:id', async (req, res) => {
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

router.post('/api/movies', async (req, res) => {
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


router.patch('/api/movies/:id', async (req, res) => {
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


router.delete('/api/movies/:id', async (req, res) => {
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

module.exports = router