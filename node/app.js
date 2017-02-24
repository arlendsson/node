/* dependencies */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var config = require('./config');
var port = process.env.PnpmORT || 3000;

var index = require('./routes/index');
var users = require('./routes/users');
var bbs = require('./routes/bbsMongo');

// ##### EJS
var engine = require('ejs-locals');

// ##### db connection
var connection  = require('express-myconnection');
var mysql = require('mysql');


var app = express();


mongoose.connect(
  config.mongodbUri
  , {
    server: {
      socketOptions: {
        socketTimeoutMS:0,
        connectionTimeout:0
      }
    }
  }
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// ##### EJS
app.set('view engine', 'ejs');




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/', index);
app.use('/users', users);
app.use('/bbs', bbs);

// ##### db connection
app.use(
  connection(
      mysql, {
        host: '127.0.0.1',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'study'
      }
      , 'request'
  )
);

// #####  EJS
app.engine('ejs', engine);
/* #####
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
*/



module.exports = app;
