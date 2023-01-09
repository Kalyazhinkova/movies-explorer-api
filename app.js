import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';

import { router } from './routes/index.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { middleError } from './middlewares/error.js';
import { limiter } from './middlewares/limiter.js';
import { serverMessage, serverMessageError, configError } from './errors/constants.js';

export const run = async (envName) => {
  try {
    process.on('unhandleRejection', (err) => {
      console.error(err);
      process.exit(1); // выход с ошибкой
    });

    const isProduction = envName.includes('prod');

    const config = dotenv.config({
      path: path.resolve(isProduction ? '.env' : '.env.common'),
    }).parsed;
    if (!config) {
      throw new Error(configError);
    }

    config.NODE_ENV = envName;
    config.IS_PROD = isProduction;

    const app = express();

    // Массив доменов, с которых разрешены кросс-доменные запросы
    const allowedCors = [
      'https://api.diploma.kalyazhinkova.nomoredomains.club',
      'http://api.diploma.kalyazhinkova.nomoredomains.club',
      'http://diploma.kalyazhinkova.nomoredomains.club',
      'https://diploma.kalyazhinkova.nomoredomains.club',
      'localhost:3000'];

    app.use(cors({
      origin: allowedCors,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(limiter);

    // для локального запуска
    // app.use(cors({
    //   origin: '*', allowedHeaders: ['Content-Type', 'Authorization'],
    // }));

    app.set('config', config);
    app.use(bodyParser.json());
    app.use(requestLogger);
    app.use(helmet());
    app.use(router);
    app.use(errorLogger);
    app.use(errors());
    app.use(middleError);

    mongoose.set('runValidators', true);
    await mongoose.connect(config.DB_URL);
    const server = app.listen(config.PORT, config.HOST, () => {
      console.log(`${serverMessage} http://${config.HOST}:${config.PORT}`);
    });

    // завершаем работу приложения
    const stop = async () => {
      await mongoose.connection.close();
      server.close();
      process.exit(0); // выход без ошибок
    };

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
  } catch (err) {
    console.error(`${serverMessageError}:${err.message}`);
  }
};
