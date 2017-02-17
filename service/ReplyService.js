/**
 * Created by cheese on 2017. 1. 24..
 */

const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	Reply = {};


Reply.Write = (info, callback) => {
	connection.query(QUERY.Reply.Write,
		[
			info.video_id,
			info.user_id,
			info.comment
		],
		(err, rows) => {
			if (!err) {
				callback(null, rows);
			} else {
				callback(err, null);
			}
		});
};

Reply.GetList = (info, callback) => {
	connection.query(QUERY.Reply.GetListByVideoID,
		[
			info.video_id,
			info.offset,
			info.size
		],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
			}
		});
};

Reply.ReadById = (info, callback) => {
	connection.query(QUERY.Reply.ReadById,
		[
			info.user_id,
			info.reply_id
		],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
			}
		});
};

Reply.UpdateById = (info, callback) => {
	connection.query(QUERY.Reply.UpdateById,
		[
			info.comment,
			info.reply_id,
			info.user_id,
		],
		(err, rows) => {
			if (!err) {
				callback(null, rows);
			} else {
				callback(err, null);
			}
		});
};

Reply.DeleteById = (info, callback) => {
	connection.query(QUERY.Reply.DeleteById,
		[
			info.reply_id,
			info.user_id
		],
		(err, rows)=>{
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
			}
		});
};

module.exports = Reply;
