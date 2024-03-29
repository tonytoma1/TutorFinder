var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config()
const {WebSocketServer} = require('ws');

var accountRouter = require('./routes/account-router');
var tutorRouter = require('./routes/tutor-router');
const jwtRouter = require('./routes/jwt-router');

var app = express();
app.use(cors());
app.options('*', cors());


mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


mongoose.connection.on("error", err => {

  console.log("err", err)

})

mongoose.connection.on("connected", (err, res) => {

  console.log("mongoose is connected")

})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/account', accountRouter);
app.use('/api/tutor', tutorRouter);
app.use('/api/jwt', jwtRouter);

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
