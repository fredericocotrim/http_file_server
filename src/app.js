import express from 'express';
import 'express-async-errors';
// import * as Sentry from '@sentry/node';
// import sentryConfig from './config/sentry';
// import cors from 'cors';
import Youch from 'youch';
// import routes from './routes';
import path from 'path';

class App {
  constructor() {
    this.server = express();

    // Sentry.init(sentryConfig);
    // this.server.use(Sentry.Handlers.requestHandler());

    this.middlewares();
    this.routes();

    // this.server.use(Sentry.Handlers.errorHandler());

    this.exceptionHandler();
  }

  middlewares() {
    //   this.server.use(
    //     cors({
    //       // origin: true,
    //       origin: '*',
    //       // origin: 'http://localhost:3003',
    //       // origin: ['http://localhost:3003', 'http://192.168.0.101:3003'],
    //     })
    //   );

    this.server.use(express.json());

    this.server.use((req, res, next) => {
      if (process.env.APP_TOKEN !== '') {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return res.status(401).send('Unauthorized');
        }

        const [, token] = authHeader.split(' ');

        if (token !== process.env.APP_TOKEN) {
          return res.status(401).send('Unauthorized');
        } else {
          return next();
        }
      }
    });
  }

  routes() {
    const publicPath = path.join(__dirname, process.env.APP_PUBLIC_PATH);
    console.log('Public Path: ', publicPath);

    this.server.use(process.env.APP_PREFIX || '', express.static(publicPath));
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).send('Internal Server Error');
    });
  }
}

export default new App().server;
