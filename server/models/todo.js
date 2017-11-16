var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    require: true,
    trim: true,
    minlength: 1
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Todo};
