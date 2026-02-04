const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { errorHandler } = require('./middlewares/error.middleware');
const apiRouter = require('./interfaces/http/routes');

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes API
app.use('/api', apiRouter);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;

