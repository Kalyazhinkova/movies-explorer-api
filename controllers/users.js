import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const badRequestError = (message) => new BadRequestError(message);
const notUniqueErrorCode = 11000;

export const login = (req, res, next) => {
  User.findOneAndValidatePassword(req.body)
    .then((user) => {
      const { JWT_SALT } = req.app.get('config');
      const token = jwt.sign({ _id: user._id }, JWT_SALT, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

export const create = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return User.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...user } = document.toObject();
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === notUniqueErrorCode) {
        next(new ConflictError('Пользователь с такой почтой уже существует!'));
      } else if (err.name === 'ValidationError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const read = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const update = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, email }, { new: true })
    .then((updateUser) => {
      if (updateUser) {
        res.send({ data: updateUser });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с такой почтой уже существует!'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};
