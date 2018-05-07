var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
  projectName:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  image:{
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
  screenshots: [{
    type: String,
    default: null
  }],
  tags: [{
    tag:{
      type: String,
      default: null
    }
  }]
});

var Project = mongoose.model('Project', ProjectSchema);

module.exports = {Project};
