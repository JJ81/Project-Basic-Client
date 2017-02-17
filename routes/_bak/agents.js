var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_dbc = require('../../commons/db_conn')();
var connection = mysql_dbc.init();
var async = require('async');
var QUERY = require('../../database/query');
var UTIL = require('../../util/util');
var HomeDAO = require('../../RedisDAO/_bak/HomeDAO');
// var JSON = require('JSON');


// INFO global로 매핑을 할 경우 읽어오지 못한다
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


/**
 * Agent page
 * */
var AgentService = require('../../service/_bak/AgentService');
router.get('/', isAuthenticated, function (req, res) {

  if (req.user.layer === 3) {
    res.redirect('/home');
  }

  var agent_code = req.user.agent;
  var layer = req.user.layer;

  AgentService.GetAgentList(req.cache, connection, agent_code, layer, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      // console.log(result);
      res.render('agents', {
        current_path: 'Agents',
        title: PROJ_TITLE + 'Agents',
        loggedIn: req.user,
        agent_list: result
      });
    }
  });
});


/**
 * Each Agent's Balance History Page
 */
router.get('/history', isAuthenticated, function (req, res) {
  var _target_agent = req.query.agentName;

  var _date = {
    startDate: req.query.startDate || UTIL.GetCurrentDateTime('.'),
    endDate: req.query.endDate || UTIL.GetCurrentDateTime('.')
  };


  console.log('target agent is : ' + _target_agent);

  /* TODO  공통 로직이 될거같다 */
  var _err = {
    mysql_read: null,
    redis_read: null,
    redis_create: null
  };

  var REDIS_KEY = 'AMS:AGENT:' + _target_agent + ':DATE::'+ _date.startDate + ':' + _date.endDate;

  console.log(REDIS_KEY);

  var task = [
    function (callback) {
      HomeDAO.QueryHomeReadByDate(req.cache, REDIS_KEY, function (err, cached) {
        _err.redis_read = err;
        callback(null, cached);
      })
    },
    function (cached, callback) {
      if (cached === null || _err.redis_read) {
        console.log('from mysql');
        connection.query(QUERY.HOME.READBYDATE, [_target_agent, _date.startDate + ' 00:00:00', _date.endDate + ' 23:59:59'], function (err, mysql_result) {
          callback(null, mysql_result, 'mysql');
        })
      } else {
        console.log('from redis');
        callback(null, cached, 'redis');
      }
    },
    function (data, from, callback) {
      if (from === 'mysql') {
        HomeDAO.CacheWithAgentWallet(req.cache, REDIS_KEY, JSON.stringify(data), function (err, data) {
          _err.redis_create = err;
          callback(null, data);
        })
      } else {
        callback(null, JSON.parse(data));
      }
    }
  ];

  async.waterfall(task, function (err, data) {
    if (_err.mysql_read) {
      /*mysql err 500 */
      console.error('ERROR:AGENT:HISTORY:MYSQL:READ ->' + _err.mysql_read);
      return next(new Error(_err.mysql_read));
    } else {
      if (_err.redis_create) {
        console.error('ERROR:AGENT:HISTORY:REDIS:CREATE ->' + _err.redis_create);
      }
      if (_err.redis_read) {
        console.error('ERROR:AGENT:HISTORY:REDIS:READ ->' + _err.redis_read);
      }
      res.render('home', {
        current_path: 'Agent Balance History',
        title: PROJ_TITLE + 'Agent Balance History',
        loggedIn: req.user,
        agentName: _target_agent,
        date: _date.startDate + ' - ' + _date.endDate,
        data: data
      })
    }

  });
});

module.exports = router;