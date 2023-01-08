import { Router } from 'express';
import {
  create, login,
} from '../controllers/users.js';
import {
  celebrateBodyAuth,
  celebrateBodyUser,
} from '../validators/users.js';
import { userRouter } from './users.js';
import { moviesRouter } from './movies.js';
import { auth } from '../middlewares/auth.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const router = Router();

// создает пользователя с переданными в теле данными
router.post('/signup', celebrateBodyUser, create);

//  проверяет переданные в теле почту и пароль
router.post('/signin', celebrateBodyAuth, login);

router.use(auth);
router.use('/', userRouter);
router.use('/', moviesRouter);
router.all('/*', () => { throw new NotFoundError('Запрашиваемая страница не найдена'); });
