/**
 * Created by cheese on 2017. 2. 2..
 */
const
    mysql_dbc = require('../commons/db_conn')(),
    connection = mysql_dbc.init(),
    bcrypt = require('bcrypt'),
    QUERY = require('../database/query'),
    Admin = {};


Admin.onLive = (link, callback) => {
    const _obj = {
        start_dt: new Date(),
        end_dt: null,
        status: 1,
        link: link
    };
    connection.query(QUERY.Broadcast.LiveOn, _obj, (err, result) => {
        if (!err) {
            callback(null, {success: true, msg: '생방송 등록 완료'});
        } else {
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};

Admin.endLive = (id, callback) => {
    
    connection.query(QUERY.Broadcast.LiveEnd, [new Date(), id],(err, result)=>{
        console.log(err);
        if (!err) {
            callback(null, {success: true, msg: '생방송 종료 완료'});
        } else {
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};
module.exports = Admin;