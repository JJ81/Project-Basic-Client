var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_dbc = require('../../commons/db_conn')();
var connection = mysql_dbc.init();
var QUERY = require('../../database/query');
var GameDAO = require('../../RedisDAO/GameDAO');
var AgentService = require('../../service/AgentService');
var CommonDAO = require('../../RedisDAO/CommonDAO');
var UTIL = require('../../util/util');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


/**
 * 게임 데이터
 */
router.get('/game', isAuthenticated, function (req, res) {
  var
    startDt = req.query.startDt || UTIL.GetCurrentDateTime('.'),
    endDt = req.query.endDt || UTIL.GetCurrentDateTime('.'),
    viewType = req.query.viewType || 'player', // player, agent, day
    REDIS_KEY = '',
    _QUERY = ''; // per player, agent, day 로 보여주는 형식에 따라서 다른 쿼리와 다른 레디스키를 조합하여 사용해야 한다.


  // 1. 뷰타입을 결정한다.
  // 2. 타입에 따라서 어떤 쿼리를 호출할 것인지 결정한다.
  // 3. todo 어떤 레디스 키가 필요한지 조합한다. -> 레디스 딕셔너리가 필요하다(정의서) !!!!!
  if (viewType === 'player') {
    _QUERY = QUERY.GAME.GetGameDataByDate;
    REDIS_KEY = 'AMS:GAME:' + req.user.agent + ':PerPlayer:' + ':DATE:' + startDt + ':' + endDt;
  } else if (viewType === 'agent') {
    _QUERY = QUERY.GAME.GetGameDataByDateWithAgent;
    REDIS_KEY = 'AMS:GAME:' + req.user.agent + ':PerAgent:' + ':DATE:' + startDt + ':' + endDt;
  } else if (viewType == 'day') {
    _QUERY = QUERY.GAME.GetGameDataByDateWithDay;
    REDIS_KEY = 'AMS:GAME:' + req.user.agent + ':PerDay:' + ':DATE:' + startDt + ':' + endDt;
  } else {
    _QUERY = QUERY.GAME.GetGameDataByDate;
    viewType = 'player';
    REDIS_KEY = 'AMS:GAME:' + req.user.agent + ':PerPlayer:' + ':DATE:' + startDt + ':' + endDt;
  }

  AgentService.GetAgentList(req.cache, connection, req.user.agent, req.user.layer, function (err, list) {
    if (err) {
      console.error(err);
    } else {
      GameDAO.QueryByDateWithKey(req.cache, REDIS_KEY, function (err, data) {
        if (err) {
          console.error(err);
        } else {
          if (data !== null) {
            console.info('Get data from redis : ' + REDIS_KEY);
            res.render('game', {
              current_path: 'Game Report',
              title: PROJ_TITLE + 'Game Report',
              data: JSON.parse(data),
              date: startDt + ' - ' + endDt,
              loggedIn: req.user,
              agent_list: list,
              viewType: viewType
            });
          } else {
            console.info('Query game data from mysql');
            connection.query(_QUERY, [startDt, endDt, UTIL.SubstractAgentList(list)], function (err, rows) {
              if (err) {
                console.error(err);
              } else {
                console.info('Cache game data in Redis ' + REDIS_KEY);

                GameDAO.CacheWithDateKey(req.cache, REDIS_KEY, JSON.stringify(rows), function (err, result) {
                  if (err) {
                    console.error(err);
                  } else {
                    res.render('game', {
                      current_path: 'Game Report',
                      title: PROJ_TITLE + 'Game Report',
                      data: rows,
                      date: startDt + ' - ' + endDt,
                      loggedIn: req.user,
                      agent_list: list,
                      viewType: viewType
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });
});


/**
 *financial 데이터
 */
router.get('/financial', isAuthenticated, function (req, res) {
  var
    startDt = req.query.startDt || UTIL.GetCurrentDateTime('.'),
    endDt = req.query.endDt || UTIL.GetCurrentDateTime('.'),
    viewType = req.query.viewType || 'player',
    REDIS_KEY = '',
    _QUERY = '',
    _param = '';


  AgentService.GetAgentList(req.cache, connection, req.user.agent, req.user.layer, function (err, list) {
    if (err) {
      console.error(err);
    } else {

      if (viewType === 'player') {
        _QUERY = QUERY.FINANCIAL.GetFinancialDataByDate;
        REDIS_KEY = 'AMS:FINANCIAL:' + req.user.agent + ':PerPlayer:' + ':DATE:' + startDt + ':' + endDt;
        _param = [startDt + ' 00:00:00', endDt + ' 23:59:59', UTIL.SubstractAgentList(list), startDt + ' 00:00:00', endDt + ' 23:59:59'];
      } else if (viewType === 'agent') {
        _QUERY = QUERY.FINANCIAL.GetFinancialDataPerAgent;
        REDIS_KEY = 'AMS:FINANCIAL:' + req.user.agent + ':PerAgent:' + ':DATE:' + startDt + ':' + endDt;
        _param = [startDt + ' 00:00:00', endDt + ' 23:59:59', UTIL.SubstractAgentList(list), startDt + ' 00:00:00', endDt + ' 23:59:59', UTIL.SubstractAgentList(list), UTIL.SubstractAgentList(list)];
      } else if (viewType == 'day') {
        _QUERY = QUERY.FINANCIAL.GetFinancialDataPerDay;
        REDIS_KEY = 'AMS:FINANCIAL:' + req.user.agent + ':PerDay:' + ':DATE:' + startDt + ':' + endDt;
        _param = [startDt + ' 00:00:00', endDt + ' 23:59:59', UTIL.SubstractAgentList(list), startDt + ' 00:00:00', endDt + ' 23:59:59', UTIL.SubstractAgentList(list)];
      } else {
        _QUERY = QUERY.FINANCIAL.GetFinancialDataByDate;
        viewType = 'player';
        REDIS_KEY = 'AMS:FINANCIAL:' + req.user.agent + ':PerPlayer:' + ':DATE:' + startDt + ':' + endDt;
        _param = [startDt + ' 00:00:00', endDt + ' 23:59:59', UTIL.SubstractAgentList(list), startDt + ' 00:00:00', endDt + ' 23:59:59'];
      }

      CommonDAO.QueryDataByKeyName(req.cache, REDIS_KEY, function (err, cached) {
        if (err) {
          console.error(err);
        } else {
          if (cached !== null) {
            console.info('return from Redis');

            console.log(JSON.parse(cached));
            res.render('financial', {
              current_path: 'Financial Report',
              title: PROJ_TITLE + 'Financial Report',
              loggedIn: req.user,
              agent_list: list,
              data: JSON.parse(cached),
              date: startDt + ' - ' + endDt,
              viewType: viewType
            });
          } else {
            connection.query(_QUERY, _param, function (err, rows) {
              if (err) {
                console.error(err);
              } else {
                console.info('Cached in Redis and return from mysql');
                CommonDAO.CacheWithKeyName(req.cache, REDIS_KEY, JSON.stringify(rows), function (err, result) {
                  if (err) {
                    console.error(err);
                  }

                  res.render('financial', {
                    current_path: 'Financial Report',
                    title: PROJ_TITLE + 'Financial Report',
                    loggedIn: req.user,
                    agent_list: list,
                    data: rows,
                    date: startDt + ' - ' + endDt,
                    viewType: viewType
                  });
                });
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router;