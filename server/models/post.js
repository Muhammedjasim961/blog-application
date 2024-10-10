const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
