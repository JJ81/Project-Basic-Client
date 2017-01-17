var express = require('express');
var router = express.Router();
//var mysql = require('mysql');
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();


// var PROJ_TITLE = "Hold'em Club AMS, ";
var bcrypt = require('bcrypt');
var async = require('async');
var QUERY = require('../database/query');
require('../commons/helpers');
var UTIL = require('../util/util');
var CommonDAO = require('../RedisDAO/CommonDAO');
var AgentService = require('../service/AgentService');

/**
 * 모든 플레이어를 보여준다.
 * 회원가입일자 내림차순으로 정렬하여 조회한다.
 */


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


/**
 * 로그인한 에이전트 및 그 하위 에이전트에 속한 플레이어들을 호출할 수 있도록 한다.
 */
router.get('/', isAuthenticated, function (req, res) {

  var
    agent_code = req.user.agent,
    layer = req.user.layer,
    REDIS_KEY = 'AMS:PLAYER:' + agent_code + ':PLAYERLIST:',
    _list = null
    ;

  /*
   * 1. 정렬된 에이전크 코드 리스트를 가져온다
   * 2. Redis Player List 유무 검사
   * 3. 있을 경우 다음작업 콜백 , 콜백 종료
   * 4. 없는 경우 mysql  쿼리조회 이후 레디스에 저장
   * */
  var task = [
    function (callback) {
      AgentService.GetAgentList(req.cache, connection, agent_code, layer, function (err, list) {
        _list = list;
        callback(null);
      })
    },
    function (callback) {
      CommonDAO.QueryDataByKeyName(req.cache, REDIS_KEY, function (err, cached) {
        callback(null, cached);
      });
    },
    function (cached, callback) {
      if (cached === null) {
        var agentListArray = UTIL.SubstractAgentList(_list);
        connection.query(QUERY.PLAYER.GetPlayerListByAgentList, [agentListArray], function (err, rows) {
          callback(null, rows, 'mysql');
        })
      } else {
        callback(null, cached, 'redis');
      }
    },
    function (result, from, callback) {
      if (from === 'mysql') {
        CommonDAO.CacheWithKeyName(req.cache, REDIS_KEY, JSON.stringify(result), function (err, data) {
          console.log('from mysql...');
          callback(null, result);
        });
      } else {
        callback(null, JSON.parse(result));
        console.log('from mysql...');
      }
    }
  ];

  async.waterfall(task, function (err, result) {
    if (false) {
      //  TODO  ERROR 핸들링정리할것
    } else {
      console.log(_list);
      res.render('players', {
        current_path: 'Players',
        title: PROJ_TITLE + 'Players',
        loggedIn: req.user,
        data: result, // 플레이어 리스트 리턴
        agent_list: _list // 셀렉트 박스 제공
      });
    }
  });
});

/**
 * 특정 플레이어의 밸런스 히스토리 페이지
 */
router.get('/history', isAuthenticated, function (req, res) {
  var _username = req.query.username,
    _date = {
      startDate: req.query.startDt || UTIL.GetCurrentDateTime('.'),
      endDate: req.query.endDt || UTIL.GetCurrentDateTime('.')
    };

  var REDIS_KEY = "AMS:PLAYERS:" + req.user.agent + ':' + _username + ':DATA::' + _date.startDate + ':' + _date.endDate;

  var task = [
    function (callback) {
      CommonDAO.QueryDataByKeyName(req.cache, REDIS_KEY, function (err, cached) {
        callback(null, cached)
      })
    },
    function (cached, callback) {
      if (cached === null) {
        connection.query(QUERY.PLAYER.QueryBalanceDataByUserName, [_username, _date.startDate + ' 00:00:00', _date.endDate + ' 23:59:59', _username, _date.startDate + ' 00:00:00', _date.endDate + ' 23:59:59'],
          function (err, result) {
            console.log('from mysql...');
            callback(null, result, 'mysql')
          })
      } else {
        console.log('from redis ...');
        callback(null, cached, 'redis')
      }
    },
    function (result, from, callback) {
      if (from === 'mysql') {
        CommonDAO.CacheWithKeyName(req.cache, REDIS_KEY, JSON.stringify(result), function (err, result) {
          callback(null, result)
        })
      } else {
        callback(null, JSON.parse(result))
      }
    }
  ];

  async.waterfall(task, function (err, result) {
    if (false) {
      // TODO ERROR 처리 로직 추가 시킬것
    } else {
      res.render('playerBalanceHistory', {
        current_path: 'Player Balance History',
        title: PROJ_TITLE + 'Players Balance History',
        loggedIn: req.user,
        player: _username,
        date: _date.startDate + ' - ' + _date.endDate,
        data: result
      });
    }
  });
});


module.exports = router;