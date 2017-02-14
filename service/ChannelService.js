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
    Channel = {};


Channel.getListAll = (callback) => {
    connection.query(QUERY.Channel.ListAll, (err, result) => {
        callback(err, result);
    });
};

Channel.getListSpecial = (callback) => {
    connection.query(QUERY.Channel.ListSpecial, (err, result) => {
        callback(err, result);
    });
};

Channel.getListGeneral = (callback) => {
    connection.query(QUERY.Channel.ListGeneral, (err, result) => {
        callback(err, result);
    });
};

Channel.getListUnder = (callback) => {
    connection.query(QUERY.Channel.ListUnder, (err, result) => {
        callback(err, result);
    });
};

Channel.set = (req, callback) => {
    const  channel_id = uuid.v1();
    
    const tasks = [
        (callback) => {
            Upload.formidable(req, (err, files, field) => {
                callback(err, files, field);
            });
        },
        
        (files, field, callback) => {
            Upload.s3Multiple(files, `${Upload.s3Keys.channel+channel_id}/`, (err, result) => {
                callback(err, field);
            });
        },
        
        (field, callback) => {
            const values = {
                channel_id: channel_id,
                title: field.title,
                type: field.type,
                link: field.link,
                created_dt: new Date()
            };

            connection.query(QUERY.Channel.Register, values, (err, result) => {
                callback(err, result);
            });
        }
    ];
    
    async.waterfall(tasks, (err, result) => {
        callback(err, result);
    });
    
    
};


module.exports = Channel;

