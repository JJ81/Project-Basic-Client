/**
 * Created by cheese on 2017. 2. 14..
 */
const
    mysql_dbc = require('../commons/db_conn')(),
    connection = mysql_dbc.init(),
    QUERY = require('../database/query'),
    async = require('async'),
    Upload = require('../service/UploadService'),
    uuid = require('node-uuid'),
    Video = {};


Video.getList = (channel_id, callback) => {
    connection.query(QUERY.Video.List, channel_id, (err, result) => {
        callback(err, result);
    });
};

Video.upload = (req, callback) => {
    const video_id = uuid.v1();
    
    const tasks = [
        (callback) => {
            Upload.formidable(req, (err, files, field) => {
                callback(err, files, field);
            });
        },
        
        (files, field, callback) => {
            Upload.s3Multiple(files, `${Upload.s3Keys.channel}${field.channel_id}/${video_id}/`, (err, result) => {
                callback(err, field);
            });
        },
        
        (field, callback) => {
        
            const values = {
                channel_id: field.channel_id,
                video_id: video_id,
                title: field.title,
                link: field.link,
                active: 0,
                created_dt: new Date()
            };
            
            connection.query(QUERY.Video.Register, values, (err, result) => {
                callback(err, result);
            });
        }
    ];
    
    async.waterfall(tasks, (err, result) => {
        callback(err, result);
    });
    
    
};

module.exports = Video;