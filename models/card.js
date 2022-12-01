const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: URL,
    require: true
  },
  owner: {
    type: ObjectId,
    required: true
  },
  likes: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('card', cardSchema);