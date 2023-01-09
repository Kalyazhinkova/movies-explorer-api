import mongoose from 'mongoose';
import isUrlValid from 'url-validation';
import { imageValidationError, trailerValidationError, thumbnailValidationError } from '../errors/constants.js';

const { Schema } = mongoose;

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isUrlValid(link),
      message: () => imageValidationError,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isUrlValid(link),
      message: () => trailerValidationError,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isUrlValid(link),
      message: () => thumbnailValidationError,
    },
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const Movie = mongoose.model('movie', movieSchema);
