var mongoose = require('mongoose');

var Project = mongoose.model('Project', {
  projectName:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description:{
    type: String,
    default: null
  },
  addedAt: {
    type: Number,
    default: null
  },
  content: {
    type: String,
    default: null
  },
  tags: [{
    tag: String,
    required: true
  }]
});

module.exports = {Project};
