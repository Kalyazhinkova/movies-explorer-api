import { Joi, Segments } from 'celebrate';
import { celebrate, sсhemaObjectId } from './common.js';

export const schemaName = Joi.string().min(2).max(30).required();
export const schemaString = Joi.string().required();
export const schemaNumber = Joi.number().required();
export const schemaRouterId = sсhemaObjectId;

export const schemaObjectMovie = Joi.object(
  {
    country: schemaString,
    director: schemaString,
    duration: schemaNumber,
    year: schemaString,
    description: schemaString,
    image: schemaString,
    trailerLink: schemaString,
    thumbnail: schemaString,
    movieId: schemaNumber,
    nameRU: schemaString,
    nameEN: schemaString,
  },
);
export const schemaObjectRouterId = Joi.object({ id: schemaRouterId }).required();

export const segmentBodyMovie = { [Segments.BODY]: schemaObjectMovie };
export const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouterId };

export const celebrateBodyMovie = celebrate(segmentBodyMovie);
export const celebrateParamsRouteId = celebrate(segmentParamsRouteMe);
