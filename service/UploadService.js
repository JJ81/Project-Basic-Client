const
	formidable = require('formidable'),
	AWS = require('aws-sdk'),
	s3 = new AWS.S3(),
	Upload = {};



const form = new formidable.IncomingForm({
	encoding: 'utf-8',
	multiples: true,
	keepExtensions: false //확장자 제거
});

/*S3 버킷 설정*/
const params = {
	Bucket: 'holdemclub',
	Key: null,
	ACL: 'public-read',
	Body: null
};

Upload.formidable =(req, callback) =>{
    
	form.parse(req, (err, fields, files)=>{
		console.log(fields);
		console.log(files);
	});
    
    
	form.on('end', function () {
		callback(null, this.openedFiles);
	});
    
	form.on('error', function (err) {
		callback('form.on(error) :' + err);
	});
    
	form.on('aborted', function () {
		callback('form.on(aborted)');
	});
};


Upload.s3 = (file_path, key, callback) => {
	params.Key = key;
	params.Body = require('fs').createReadStream(file_path);
    
	s3.upload(params, function(err, result){
		callback(err, result);
	});
};


module.exports =Upload;

