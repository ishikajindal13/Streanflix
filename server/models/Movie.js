const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: 'Unknown',
  },
  year: {
    type: Number,
  },
})

module.exports = mongoose.model('Movie', movieSchema)
