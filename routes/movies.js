import { Router } from 'express';
import {
  read, create, remove,
} from '../controllers/movies.js';
import { celebrateBodyMovie, celebrateParamsRouteId } from '../validators/movies.js';

export const moviesRouter = Router();

moviesRouter.get('/movies', read);
moviesRouter.post('/movies', celebrateBodyMovie, create);
moviesRouter.delete('/movies/:id', celebrateParamsRouteId, remove);
