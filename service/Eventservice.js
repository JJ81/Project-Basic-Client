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

Event.uploadResult = (req, callback) => {
    
    /**
     * @task 작업순서
     *  1. formidable로 EC 업로드
     *  2. EC 업로드된 파일을 다시 S3업로드
     *  3. event_result 추가
     *  4. event status 완료로 변경
     *
     *  TODO 트렌젹션이 필요한가?
     */
    
    const tasks = [
        
        (callback) => {
            Upload.formidable(req, (err, files, field) => {
                callback(err, files, field);
            });
        },
        
        (files, field, callback) => {
            Upload.s3(files, Upload.s3Keys.event, (err, result, s3_file_name) => {
                callback(err, s3_file_name, field);
            });
        },
        
        (s3_file_name, field, callback) => {
            const _obj = {
                event_id: field.event_id,
                result_img: s3_file_name,
                created_dt: new Date()
            };
            connection.query(QUERY.Event.ResultRegister, _obj, (err, result) => {
                callback(err, field);
            });
        },
        
        (field, callback) =>{
            connection.query(QUERY.Event.StatusChange, ['C', field.event_id], (err, result) => {
                callback(err, result);
            });
        }
    ];
    
    async.waterfall(o, (err, result) => {
        if (!err) {
            callback(null, {success: true, msg: '방송표 업로드 완료'});
        } else {
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};

Event.delete = (event_id, callback) => {
    
    /**
     * @task 작업순서
     *  1. 해당 이벤트 상태를 진행중으로 변경
     *  2. 이벤트 결과 테이블에서 제거
     *
     *  TODO 트렌젹션이 필요한가?
     */
    const tasts = [
        
        (callback) => {
            connection.query(QUERY.Event.StatusChange, ['P', event_id], (err, result) => {
                callback(err, result);
            });
        },
        
        (callback) => {
            connection.query(QUERY.Event.ResultDelete, event_id, (err, result) => {
                callback(err, result);
            });
        }
    ];
    
    async.series(tasts, (err, result) =>{
        callback(err, result);
    });
};

Event.getList = (callback) => {
    connection.query(QUERY.Event.ListGet, (err, result) => {
        callback(err, result);
    });
};
module.exports = Event;