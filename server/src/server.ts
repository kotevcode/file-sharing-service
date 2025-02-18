import 'module-alias/register';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from '@/models';
import routes from '@/routes';
import CustomError from '@/libs/errors/customError';

const port = process.env.PORT ? process.env.PORT : 4040;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(require('express-log-url'));

app.use('/v1', routes);

app.get('/health-check', async (req, res, next) => {
  let dbStatus = 200;
  let err;
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    err = error;
    dbStatus = 500;
    console.error('Unable to connect to the database:', error);
  }
  res.status(dbStatus);
  res.json({
    healthy: dbStatus === 200,
    time   : Date.now(),
    err,
  });
});

// 404: catch 404 and forward to error handler

app.use((req, res, next) => {
  const err: CustomError = new Error('Not Found') as CustomError;
  err.status = 404;
  next(err);
});

/**
 * error handler
 */

app.use((err: CustomError, req: Request, res, next: NextFunction) => {
  err.status = err.status || 500;

  console.log(req.url, err);

  res.status(err.status)
    .json({
      status     : 'error',
      status_code: err.status,
      message    : err.message,
    });
});

const server = app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

// Ensure all inactive connections are terminated by the ALB, by setting this a few seconds higher than the ALB idle timeout
server.keepAliveTimeout = 65000;
// Ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363
server.headersTimeout = 66000;
