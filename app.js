var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*routes*/
var routes = require('./routes/index');
var api = require('./routes/api');
var agents = require('./routes/agents');
var players = require('./routes/players');
var report = require('./routes/reports');


/*routes*/
var app = express();
var hbs = require('hbs');
var passport = require('passport');
var flash = require('connect-flash');
var cookieSession = require('cookie-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/modal');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieSession({
  keys: ['AMS_Admin']
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));


var allowCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  (req.method === 'OPTIONS') ?
    res.send(200) :
    next();
};

global.PROJ_TITLE = "Hold'em Club AMS, ";


app.use(allowCORS);
app.use('/', routes);
app.use('/agents', agents);
app.use('/players', players);
app.use('/report', report);
app.use('/api/v1', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {

  // todo 로그인을 하지 않았다면 로그인 페이지로 자동 이동한다.
  //if(req.user === null){
  //  res.redirect('/login');
  //}

  console.error('404 error');
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
  res.render('404', {
    current_path: '404 Error Page',
    title: PROJ_TITLE + 'ERROR PAGE',
    loggedIn: req.user
  });

});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
      current_path: '500 Error Page',
      title: PROJ_TITLE + 'ERROR PAGE'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error('500 error in prod');
  res.status(err.status || 500);
  res.render('500', {
    current_path: '500 Error Page',
    title: PROJ_TITLE + 'ERROR PAGE'
  });
});


// Swifty Automatic Changing ENV.
if (app.get('env') === 'local'){
  global.mysql_location = 'local';
  global.redis_location = 'local';

  console.info('local');
}else if(app.get('env') === 'development'){
  global.redis_location = 'dev';
  global.mysql_location = 'dev';

  console.info('development');
}else if(app.get('env') === 'production'){
  global.mysql_location = 'real';
  global.redis_location = 'real';

  console.info('production');
}


module.exports = app;