/**
 * Created by cheese on 2017. 1. 23..
 */

const
	express = require('express'),
	router = express.Router(),
	bcrypt = require('bcrypt'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	// async = require('async'),
	// CommonDAO = require('../RedisDAO/CommonDAO'),
	// UTIL = require('../util/util'),
	User = require('../service/UserService'),
	Reply = require('../service/ReplyService');
// Auth = require('../service/AuthService')


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


passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});


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
passport.use(new LocalStrategy({
	usernameField: 'user_id',
	passwordField: 'password',
	passReqToCallback: true
}, (req, user_id, password, done) => {
	User.login(user_id, password, (err, result) => {
		if (err) {
			return done(null, false);
		} else {
			if (result.success) {
				return done(null, result.user_info);
			} else {
				return done(null, false);
			}
		}
	});
}));


router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true
}), (req, res) => {
	res.redirect('/');
});


router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

/**
 * 홀덤클럽 회원가입
 */
router.post('/signup', (req, res) => {
    
    // TODO _obj 검사 그런데 마켓팅코드는 입력안할수있는데??, password === re_password  검사
    const _obj = {
        user_id: req.body.user_id,
        nickname: req.body.nickname,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        market_code: req.body.market_code || null,
        signup_dt: new Date()
    };
    
    User.signUp(_obj, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});


router.get('/users/duplication/user_id', (req, res) => {
    const user_id = req.query.user_id;
    
    User.duplicateByUserId(user_id, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.get('/users/duplication/nickname', (req, res) => {
    const nickname = req.query.nickname;
    
    User.duplicateByNickname(nickname, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.get('/users/duplication/email', (req, res) => {
    const email = req.query.email;
    
    User.duplicateByEmail(email, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});


//////////////////////////  API REPLY  /////////////////////////////////////

router.post('/reply/create', (req, res) => {
    //TODO 댓글이랑 답글을 한곳에서 처리하자
    
    const _obj = {
        video_id: req.body.video_id,
        comment: req.body.comment_content,
        nickname: req.user.nickname
    };
    
    Reply.write(_obj, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.put('/reply/update', (req, res) => {
    
    const _obj = {
        id: req.body.id,
        comment: req.body.comment_content,
    };
    
    Reply.modify(_obj, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.delete('/reply/delete', (req, res) => {

    const reply_id = req.body.id;

    Reply.remove(reply_id, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});


////////////////////////////////////////// API v2.0 //////////////////////////////////////////////////ㅍ

// TODO API_KEY를 제공할 수 있도록 한다?
// TODO 허용된 도메인에서만 호출이 될 수 있도록 설정한다.

const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');

/**
 * 라이브 방송 여부 체크
 */
router.get('/broadcast/live', (req, res) => {
	connection.query(QUERY.BROADCAST.GET, (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				error : err
			});
		}
	});
});

/**
 * 채널 리스트
 */
router.get('/navigation/channel/list', (req, res) => {
	connection.query(QUERY.NAVI.CHANNEL_ALL_ORDERED, (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * 최근 업데이트된 비디오
 */
router.get('/video/recent/list', (req, res) => {
	'use strict';

	let _info = {
		offset : parseInt(req.query.offset),
		limit : parseInt(req.query.size)
	};

	console.info(_info);

	connection.query(QUERY.CONTENTS.RECENT_VIDEO_LIST,
		[_info.offset, _info.limit],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success: false,
					msg : err
				});
			}
		});
});


/**
 * 추천 방송
 */
router.get('/navigation/recommend/list', (req, res) => {
	connection.query(QUERY.NAVI.CHANNEL_RECOM, (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});


/**
 * 이벤트 리스트 가져오기
 */
router.get('/event/list', (req, res) => {
	'use strict';
	let _info = {
		offset : parseInt(req.query.offset),
		limit : parseInt(req.query.size)
	};
	connection.query(QUERY.EVENT.LIST, [_info.offset, _info.limit], (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * 이벤트 결과 가져오기
 */
router.get('/event/result/:id', (req, res) => {
	console.log('@@ event id ');
	console.log(req.params.id);

	connection.query(QUERY.EVENT.RESULT, [req.params.id], (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * 투표 질문 관련 데이터 출력
 */
router.get('/event/vote/question/:id', (req, res) => {
	'use strict';
	connection.query(QUERY.EVENT.VOTE_QUESTION,
		[req.params.id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});

/**
 * 투표 결과에 대한 데이터 출력
 */
router.get('/event/vote/answer/:id', (req, res) => {
	'use strict';
	connection.query(QUERY.EVENT.VOTE_ANSWER,
		[req.params.id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});

/**
 * 채널 아이디로 해당 채널 비디오 리스트 가져오기
 */
router.get('/video/list/:channel_id', (req, res) => {
	connection.query(QUERY.VIDEO.LIST,
		[req.params.channel_id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});



module.exports = router;