/**
 * Created by cheese on 2017. 1. 23..
 */

const
  express = require('express'),
  router = express.Router(),
  mysql_dbc = require('../commons/db_conn'),
  connection = mysql_dbc().init(),
  bcrypt = require('bcrypt'),
  async = require('async'),
  QUERY = require('../database/query'),
  CommonDAO = require('../RedisDAO/CommonDAO'),
  UTIL = require('../util/util'),
  UserLogin = require('../service/UserLoginService');


/**
 * URI에 리소스명은 동사보다는 명사를 사용한다.
 * URI에 동사는 http 메서드로 대신한다.
 * 가급적이면 의미상 단수형 명사(/dog)보다는 복수형 명사(/dogs)를 사용하는 것이 의미상 표현하기가 더 좋다.
 *
 * 만약에 관계의 명이 복잡하다면 관계명을 명시적으로 표현하는 방법이 있다. 예를 들어 사용자가 “좋아하는” 디바이스 목록을 표현해보면
 * HTTP Get : /users/{userid}/likes/devices
 * 예) /users/terry/likes/devices
 *
 * 에러핸들링 공통 로직이될거같으니 하나의 힘수로 만들자
 * 가급적이면 Error Code 번호를 제공하는 것이 좋다.
 *
 * 200 성공
 * 400 Bad Request - field validation 실패시
 * 401 Unauthorized - API 인증,인가 실패
 * 404 Not found ? 해당 리소스가 없음
 * 500 Internal Server Error - 서버 에러
 *
 * 공통 URL = /api/v1/
 *
 * {행위} , {HTTP Method}, {URI}
 *
 * 로그인, 댓글, 답글, 회원가입, 아이디중복검사, 닉네임중복검사, 아이디찾기, 비빌번호 찾기(새롭게 설정함)
 * 조회수 증가로직, 게임 로그인을 위한 회원가입(유저아아디, 닉네임 받아야됨)
 * 회원 정보수정, 로그아웃,
 *
 *
 * {로그인}, {POST}, {/login}
 * {회원가입}, {POST}, {/signup}
 * {아이디중복검사}, {GET}, {/users/duplication/user_id?user_id={payer001}}
 * {닉네임중복검사}, {GET}, {/users/duplication/nickname?nickname={payer001}}
 * {회원 정보수정}, {PUT}, {/myinfo}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 *
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

/*게임 로그인에 대한 API*/
router.post('/login', function (req, res) {
  const _obj = {
    user_id: req.body.user_id,
    password: req.body.password
  };
  // TODO _obj null, undefined 로직 추가해야됨
});

/**
 * 홀덤쿨럽 티비 로그인 API
 * 로그인 실패시 로그인실패 카운트 증가, 로그인 실패 10일경우 계정락
 */
router.post('/hc/login', (req, res) => {

  const _obj = {
    user_id: req.body.user_id,
    password: req.body.password
  };

  // TODO _obj null, undefined 로직 추가해야됨
  connection.query(QUERY.COMMON.UserLogin, _obj.user, (err, result) => {
    if (err) {
      res.json({
        success: false,
        msg: '문제가 발생했습니다. 잠시 후에 다시 시도해주세요.',
      })
    } else {
      if (result.length === 0) {
        res.json({
          success: false,
          msg: '등록된 계정이 없습니다.',
        });
      } else {
        if (!bcrypt.compareSync(password, data[0].password)) {
          // 패스워드가 맞지 않을 경우, 로그인 실패 카운트를 올려준다

          if (data[0].login_fail_count >= 5 && data[0].login_fail_count < 10) {
            UserLogin.failToLogin(data[0].user_id);

            res.json({
              'success': false,
              'msg': '비밀번호가 맞지 않습니다. 로그인에 10번 이상 실패하면 계정이 정지될 수 있습니다. [현재실패횟수 : ' + parseInt(data[0].login_fail_count + 1) + ']',
            });
          } else if (data[0].login_fail_count >= 10) {
            res.json({
              'success': false,
              'msg': '계정이 정지되었습니다. [로그인실패횟수초과] info@intertoday.com으로 문의해주세요.',
            });
          } else {
            service_login.failToLogin(data[0].user_id);
            res.json({
              'success': false,
              'msg': '비밀번호가 맞지 않습니다. 다시 시도해주세요.',
            });
          }

        } else {
          // banned를 체크해보고 계정이 정지당한 유저인지 판단하여 전달한다
          if (data[0].banned) {
            res.json({
              'success': false,
              'msg': '임시로 정지당한 계정입니다. info@intertoday.com으로 문의해주세요.',
            });
          } else {
            // login_fail_count가 10회 이상일 경우 로그인을 할 수 없다.
            if (data[0].login_fail_count >= 10) {
              res.json({
                'success': false,
                'msg': '로그인을 10회이상 실패하셨습니다. info@intertoday.com으로 문의해주세요.',
              });
            } else {
              // 패스워드가 맞을 경우
              // 로그인에 성공했을 경우 로그인 실패 횟수를 0으로 초기화한다.
              UserLogin.clearFailedCount(data[0].user_id);
              res.json({
                success: true,
                msg: '로그인에 성공했습니다.',
              });
            }
          }
        }
      }
    }
  });
});


/**
 * 홀덤클럽 회원가입
 */
router.post('/signup', (req, res) => {
  const _obj = {
    user_id: req.body.user_id,
    nickname: req.body.nickname,
    password: req.body.password,
    re_password: body.re_password,
    email: req.body.email,
    hash: bcrypt.hashSync(password, 10),
    market_code: req.body.market_code || null,
    signup_dt: new Date()
  };

  // TODO _obj 검사 그런데 마켓팅코드는 입력안할수있는데??, password === re_password  검사

  if(_obj.password !== _obj.re_password){
    res.json({
      success: false,
      msg: '패스워드를 다시 확인해주세요'
    });
    return;
  }





});


module.exports = router;