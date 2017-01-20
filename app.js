
var fs                  = require('fs');
var express = require('express');
var path = require('path');
var fs                  = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator')
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategry = require('passport-local').Strategy;
var paginate = require('express-paginate');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var Category = require('./model/category');

var app = express();
app.locals.moment= require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(paginate.middleware(10, 50));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));
// passport

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(paginate.middleware(2, 5));
app.use('/pictures/', express.static(__dirname + '/routes/public/upload/'));
// app.get('/admin/*',ensureAuthenticated, function(req, res, next) {
//   res.redirect('/admin/dashboard');
// });

// function ensureAuthenticated(req,res,next){
//   if(req.isAuthenticated()){
// 	  console.log('Xac thuc thanh cong');
//     return next();
//   }
//   res.redirect('/users/login');
// }
app.use(function(req, res, next) {
  Category.find({},{}, function(err, categories){
    res.locals.categories = categories;
    next();
  });
})
app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
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

module.exports = app;
