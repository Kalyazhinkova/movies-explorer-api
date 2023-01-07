import { Router } from 'express';
import {
  create, login,
} from '../controllers/users.js';
import {
  celebrateBodyAuth,
  celebrateBodyUser,
} from '../validators/users.js';

export const router = Router();

// создает пользователя с переданными в теле данными
router.post('/signup', celebrateBodyUser, create);

//  проверяет переданные в теле почту и пароль
router.post('/signin', celebrateBodyAuth, login);
