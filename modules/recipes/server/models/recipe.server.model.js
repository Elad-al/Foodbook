'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Recipe Schema
 */  
var RecipeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Recipe name',
    trim: true
  },

  description: {
    type: String,
    default: '',
    required: 'Please fill Recipe description',
    trim: true
  },

  ingredients: {
    type: String,
    default: '',
    required: 'Please fill Recipe ingredients',
    trim: true
  },

  Preparation: {
    type: String,
    default: '',
    required: 'Please fill Recipe Preparation process',
    trim: true
  },

  category: {
    type: String,
    default: '',
    required: 'Please fill Recipe category',
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

mongoose.model('Recipe', RecipeSchema);
