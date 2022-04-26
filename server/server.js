const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { handleError } = require('./middleware/errorMiddleware');
const connectDatabase = require('./config/database');
const port = process.env.PORT || 5001;

connectDatabase();
const app = express();

app.set('views', __dirname);
app.set('view engine', 'pug');
