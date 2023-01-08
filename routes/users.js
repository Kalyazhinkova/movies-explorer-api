import { Router } from 'express';
import {
  read, update,
} from '../controllers/users.js';
import {
  celebrateBodyUserWithoutPassword,
} from '../validators/users.js';

export const userRouter = Router();

userRouter.get('/users/me', read);
userRouter.patch('/users/me', celebrateBodyUserWithoutPassword, update);
