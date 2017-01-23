/**
 * Created by cheese on 2017. 1. 23..
 */
const
  mysql_dbc = require('../commons/db_conn')(),
  connection = mysql_dbc.init(),
  QUERY = require('../database/query');

const UserLogin = {};


/**
 *로그인 실패시 로그인 실패 카운트 증가(10이상시 계정 정지)
 * @param user_id
 * @param callback
 */
UserLogin.failToLogin = (user_id, callback) => {
  connection.query(QUERY.COMMON.UserFailToLogin, user_id, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

/**
 *로그인 성공시 로그인 실패 카운트 0으로 초기화
 * @param user_id
 * @param callback
 */
UserLogin.clearFailedCount = (user_id, callback) => {
  connection.query(QUERY.COMMON.UserClearFailedCount, user_id, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

/**
 *게임 로그인시 log_access_game  로그 기록
 * @param user_id
 * @param callback
 */
UserLogin.updateGameLog = (user_id, callback) => {
  connection.query(QUERY.COMMON.UserUpdateGameLog, user_id, (err, result) => {
    if(err){
      callback(err, null);
    }else{
      callback(null, result);
    }
  })
};

exports.module = UserLogin;