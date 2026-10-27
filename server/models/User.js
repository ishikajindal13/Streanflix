
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
    myList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  }],
})

module.exports = mongoose.model('User', userSchema)
