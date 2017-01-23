const express = require('express');
const router = express.Router();
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const async = require('async');
const QUERY = require('../database/query');
const JSON = require('JSON');
require('../database/redis')(router, 'local'); // redis
require('../commons/helpers');


passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

var isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

passport.use(new LocalStrategy({
	usernameField: 'agent',
	passwordField: 'password',
	passReqToCallback: true }, (req, agent, password, done) => {
		connection.query(QUERY.AGENT.login, [agent], (err, data) => {
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
		res.redirect('/');
	}
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true
}), function (req, res) {
	res.redirect('/');
});

router.get('/logout', isAuthenticated, (req, res) => {
	req.logout();
	res.redirect('/');
});


router.get('/', (req, res) => {
	async.parallel(
	  [
		  (cb) => {
		    connection.query(QUERY.HOME.GetRecomList, (err, rows) => {
			    if(err){
				    console.error(err);
				    cb(err, null);
			    }else{
				    cb(null, rows);
			    }
		    });
      },
		  (cb) => {
	      connection.query(QUERY.HOME.GetNavAllList, (err, rows) => {
		      if(err){
			      console.error(err);
			      cb(err, null);
		      }else{
			      cb(null, rows);
		      }
        });
      }
    ], (err, result) => {
	    if(err){
	      console.error(err);
		    throw new Error(err);
      }else{
		    res.render('index', {
			    current_path : "INDEX",
			    title : PROJ_TITLE,
			    loggedIn: req.user,
			    recomList : result[0],
          contentlist : result[1]
		    });
      }
  });
});

router.get('/test', (req, res) => {
	res.json({result : 'Hello World'});
});

module.exports = router;