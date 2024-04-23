var createError = require('http-errors');

require('dotenv').config();
var express = require('express');
const mongoose = require("mongoose");
const session = require("express-session");



var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//database connection
const db = require("./models/connect");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


//middle ware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
  session({
    secret:"my secret key",
    saveUninitialized: true,
    resave:false,
  })
)

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
