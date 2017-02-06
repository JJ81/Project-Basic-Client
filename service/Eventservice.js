/**
 * Created by cheese on 2017. 2. 6..
 */
const
    mysql_dbc = require('../commons/db_conn')(),
    connection = mysql_dbc.init(),
    QUERY = require('../database/query'),
    async = require('async'),
    Upload = require('../service/UploadService'),
    Event = {};
    
    

Event.Upload = (req, callback)=>{
    
    const tasks = [
        (callback) => {
            Upload.formidable(req, (err, files, field) => {
                callback(err, files, field);
            });
        },
        (files, field, callback) => {
            Upload.s3(files, s3Keys.calendar, (err, result, s3_file_name) => {
                callback(err, s3_file_name, field);
            });
        },
        (s3_file_name, field, callback) => {
            const _obj = {
                title: field.link,
                img_name: s3_file_name
            };
            connection.query(QUERY.Event.Register, _obj, (err, result) => {
                callback(err, result);
            });
        }
    ];
    
    async.waterfall(tasks, (err, result) => {
        if (!err) {
            callback(null, {success: true, msg: '방송표 업로드 완료'});
        } else {
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};
module.exports = Event;