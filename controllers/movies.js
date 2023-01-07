import { Movie } from '../models/movie.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const badRequestError = (message) => new BadRequestError(`Некорректные данные для создания карточки фильма. ${message}`);

export const read = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

export const create = (req, res, next) => {
  req.body.owner = req.user._id;
  Movie.create(req.body)
    .then((newMovie) => {
      res.send({ data: newMovie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const remove = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый фильм не найден!');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои объекты!');
      }
      return Movie.findByIdAndRemove(req.params.id);
    }).then((movie) => { res.send(movie); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};
