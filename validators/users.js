import { Joi, Segments } from 'celebrate';
import { celebrate } from './common.js';

export const schemaEmail = Joi.string().email().required();
const schemaPassword = Joi.string().required();
const schemaName = Joi.string().min(2).max(30);

const schemaObjectUserAuth = Joi.object({ email: schemaEmail, password: schemaPassword });
const schemaObjectUser = Joi.object(
  { email: schemaEmail, password: schemaPassword, name: schemaName },
);

const segmentBodyUserAuth = { [Segments.BODY]: schemaObjectUserAuth };
const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };

export const celebrateBodyAuth = celebrate(segmentBodyUserAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
