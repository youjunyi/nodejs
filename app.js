var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var reg = require('./routes/reg');
var settings = require('./settings');
var app = express();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    /*db: settings.db,
     host: settings.host,
     port: settings.port*/
    url: 'mongodb://localhost/blog'
  })

}))
//设置默认模版路径
app.locals._layoutFile='layout'
//创建中间件
app.use(function(req, res, next){
  var err =  req.session.error;
  var msg =  req.session.success;
  //删除会话中原有属性
  delete req.session.error;
  delete req.session.success;
  //将错误和正确信息存放到动态试图助手变量中。
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
  if (msg) res.locals.message = '<div class="alert alert-success">' + msg + '</div>';
  next();

});
//使用中间件把user设置成动态视图助手
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
})
//设置程序路由
app.use('/', routes);
app.get('/u/:user', users);
app.post('/post',routes)
app.use('/reg',reg);
app.use('/doreg',reg);
app.use('/login',login);
app.get('/loginout',login);



// 使用中间件处理404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 使用中间件处理500
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 使用中间件处理500
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
