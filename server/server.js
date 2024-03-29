const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { handleError } = require('./middleware/errorMiddleware');
const connectDatabase = require('./config/database');
const port = process.env.PORT || 5001;
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');
const compression = require('compression');
const helmet = require('helmet');

connectDatabase();
const app = express();
app.use(compression());
app.use(helmet());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// error handler
app.use(handleError);

app.listen(process.env.PORT, '0.0.0.0');
