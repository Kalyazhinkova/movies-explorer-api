import { Router } from 'express';
import {
  read, create, remove,
} from '../controllers/movies.js';
import { celebrateBodyMovie, celebrateParamsRouteId } from '../validators/movies.js';

export const router = Router();

router.get('/', read);
router.post('/', celebrateBodyMovie, create);
router.delete('/:id', celebrateParamsRouteId, remove);
