import { Router } from 'express';
import {
  read, update,
} from '../controllers/users.js';
import {
  celebrateBodyUser,
} from '../validators/users.js';

export const router = Router();

router.get('/me', read);
router.patch('/me', celebrateBodyUser, update);
