const express = require('express');
const router = express.Router();
const mysql_dbc = require('../../commons/db_conn')();
const connection = mysql_dbc.init();

// INFO index에서만 한 번 아래와 같이 선언을 해주면 페이지마다 선언을 할 필요가 없다.
// TODO 아래 임포트 되는 부분은 app.js로 옮겨도 될까? 테스트 해볼 것
require('../../database/redis')(router, 'local'); // redis
require('../../commons/helpers');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const async = require('async');
const QUERY = require('../../database/query');
const JSON = require('JSON');
const UTIL = require('../../util/util');
// const HomeDAO = require('../RedisDAO/HomeDAO');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


passport.use(new LocalStrategy({
    usernameField: 'agent',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, agent, password, done) {
    connection.query(QUERY.AGENT.login, [agent], function (err, data) {
      if (err) {
        return done(null, false);
      } else {
        if (data.length === 1) {
          if (!bcrypt.compareSync(password, data[0].password)) {
            console.log('password is not matched.');
            return done(null, false);
          } else {
            console.log('password is matched.');
            console.info(data[0]);
            return done(null, {
              'agent': data[0].code,
              'layer': data[0].layer,
              'parent_id': data[0].parent_id,
              'top_parent_id': data[0].top_parent_id,
              'balance': data[0].balance
            });
          }
        } else {
          return done(null, false);
        }
      }
    });
  }
));


router.get('/login', function (req, res) {
  if (req.user == null) {
    res.render('login', {
      current_path: 'login',
      title: PROJ_TITLE + 'login'
    });
  } else {
    res.redirect('/home');
  }
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {
  res.redirect('/home');
});

router.get('/logout', isAuthenticated, function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/', isAuthenticated, function (req, res) {
  res.redirect('/home');
});


// todo 모든 에러와 관련된 페이지에 에러 페이지를 연결할 수 있도록 한다. 그리고 내부적으로는 반드시 로그를 확인할 수 있도록 설정을 한다
// todo 로그를 수집하는 툴을 사용하는 방법을 생각해본다.

/**
 * 에이전트 통장 거래 내역
 */

router.get('/home', isAuthenticated, function (req, res, next) {
  var _agent = req.user.agent;

  var _date = {
    startDate: req.query.startDate || UTIL.GetCurrentDateTime('.'),
    endDate: req.query.endDate || UTIL.GetCurrentDateTime('.')
  };

  /*TODO  공통 로직이 될거같다*/
  var _err = {
    mysql_read: null,
    redis_read: null,
    redis_create: null
  };

  var REDIS_KEY = 'AMS:HOME:' + _agent + ':DATE::' + _date.startDate + ':' + _date.endDate;
  var task = [
    function (callback) {
      HomeDAO.QueryHomeReadByDate(req.cache, REDIS_KEY, function (err, cached) {
        console.log('from redis');
        _err.redis_read = err;
        callback(null, cached);
      })
    },
    function (cached, callback) {
      if (cached === null || _err.redis_read) {
        connection.query(QUERY.HOME.READBYDATE, [_agent, _date.startDate + ' 00:00:00', _date.endDate + ' 23:59:59'], function (err, result) {
          console.log('from mysql...');
          _err.mysql_read = err;
          callback(null, result, 'mysql');
        });
      } else {
        callback(null, cached, 'redis');
      }
    },
    function (result, from, callback) {
      console.log(_date.startDate, UTIL.GetCurrentDateTime('.'));
      if (from === 'mysql') {
        HomeDAO.CacheWithAgentWallet(req.cache, REDIS_KEY, JSON.stringify(result), function (err, redis_result) {
          console.log('mysql to redis');
          _err.redis_create = err;
        });
        callback(null, result);
      } else {
        callback(null, JSON.parse(result));
      }
    }
  ];

  async.waterfall(task, function (err, result) {
    if (_err.mysql_read) {
      /*mysql read 에러시 500  처리*/
      console.error('ERROR:HOME:MYSQL:READ: ->' + _err.mysql_read);
      return next(new Error(_err.mysql_read));
    } else {
      if (_err.redis_read) {
        console.error('ERROR:HOME:REDIS:READ: ->' + _err.redis_read);
      }
      if (_err.redis_create) {
        console.error('ERROR:HOME:REDIS:CREATE: ->' + _err.redis_create);
      }
      res.render('home', {
        current_path: 'Home',
        title: PROJ_TITLE + 'Home',
        loggedIn: req.user,
        data: result,
        date: _date.startDate + ' - ' + _date.endDate,
        startDt: _date.startDate,
        endDt: _date.endDate
      })
    }
  });
});


module.exports = router;