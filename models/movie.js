import mongoose from 'mongoose';
import { urlCheck } from '../utils/constant.js';

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
      validator: (link) => urlCheck.test(link),
      message: () => 'Картинка задается в виде ссылки!',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlCheck.test(link),
      message: () => 'Трейлер задается в виде ссылки!',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlCheck.test(link),
      message: () => 'Постер задается в виде ссылки!',
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
