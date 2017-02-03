/**
 * Created by cheese on 2017. 2. 2..
 */
const
    mysql_dbc = require('../commons/db_conn')(),
    connection = mysql_dbc.init(),
    QUERY = require('../database/query'),
    async = require('async'),
    Upload = require('../service/UploadService'),
    Broadcast = {},
    s3Keys = {
        calendar: 'broadcast/calendar'
    };


Broadcast.onLive = (link, callback) => {
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

Broadcast.endLive = (id, callback) => {
    connection.query(QUERY.Broadcast.LiveEnd, [new Date(), id], (err, result) => {
        console.log(err);
        if (!err) {
            callback(null, {success: true, msg: '생방송 종료 완료'});
        } else {
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};

Broadcast.calendarUpload = (req, callback) => {
    /**
     * @tasks_작업_순서
     *      1.formidable 파일 업로드
     *      2.S3 업로드 (formidable 업로드한 파일을 다시 S3에 업로드)
     *      3. 데이터베이스에 저장
     *     TODO 4. 업로드된 파일삭제(S3 파일이 정상적으로 업로드되면 로컬에 남아있는 파일을 삭제한다.)
     */
    const tasks = [
        (callback) => {
            Upload.formidable(req, (err, files) => {
                callback(err, files);
            });
        },
        (files, callback) => {
            Upload.s3(files, s3Keys.calendar, (err, result) => {
                console.log('====================');
                console.log(files);
                console.log(result);
                console.log('====================');
                callback(err, result);
            });
        },
        // (result, cllback) => {
        // console.log(result);
        //     connection.query(QUERY.Broadcast.CalendarWrite, [], (err, result) => {
        //         callback(err, result);
        //     });
        // }
    ];
    
    async.waterfall(tasks, (err, result) => {
        if (!err) {
            callback(null, {success: true, msg: '방송표 업로드 완료'});
        } else {
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
        
    });
    
    
};

Broadcast.calendarDelete = (what) => {
    
};


module.exports = Broadcast;