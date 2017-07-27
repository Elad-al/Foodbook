'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Follwe Schema
 */
var FollweSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Follwe name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Follwe', FollweSchema);
