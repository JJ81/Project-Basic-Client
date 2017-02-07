const
    formidable = require('formidable'),
    md5 = require('md5'),
    Upload = {};

let AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2'; //지역 서울 설정
let s3 = new AWS.S3();

const form = new formidable.IncomingForm({
    encoding: 'utf-8',
    multiples: true,
    keepExtensions: false //확장자 제거
});

/*S3 버킷 설정*/
let params = {
    Bucket: 'holdemclub',
    Key: null,
    ACL: 'public-read',
    Body: null
};

Upload.s3Keys = {
    calendar: 'broadcast/calendar/',
    event: 'event/result',
};

Upload.formidable =(req, callback) =>{
    let field;
    
    form.parse(req, (err, fields, files)=>{
        field = fields;
    });
    
    form.on('end', function () {
        callback(null, this.openedFiles, field);
    });
    
    form.on('error', function (err) {
        callback('form.on(error) :' + err, null);
    });
    
    form.on('aborted', function () {
        callback('form.on(aborted)', null);
    });
};

Upload.s3 = (files, key, callback) => {
    
    const s3_file_name = makeS3FilesName(files);
    params.Key = key + s3_file_name;
    params.Body = require('fs').createReadStream(files[0].path);

    s3.upload(params, function(err, result){
        callback(err, result, s3_file_name);
    });
};

/*TODO 파일 이름이 여러개 일 경우는 어떻게 처리할것인가?*/
function makeS3FilesName(files) {
    return (md5(files[0].name));
}



module.exports =Upload;

