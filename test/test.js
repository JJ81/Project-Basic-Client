const
    assert = require('assert'),
    req = require('request'),
    expect = require('chai').expect,
    JSON = require('JSON'),
    should = require('should'),
    HOST = 'http://localhost:3002/',
    HOST_API = `${HOST}api/v1/`;

// TODO POST, PUT, DELETE는 어떻게 테스트 할것인가?

describe('[API 2.0] Should return 200', () => {
    
    describe('Broadcast Live List', ()=>{
        it('/broadcast/live', (done)=>{
            req.get(`${HOST_API}broadcast/live`, (err, res, body)=>{
                const _body = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(_body.success).to.be.true;
                done();
            });
        });
    }),
    
    // describe('Broadcast Register', () => {
    //     it('/broadcast/live', (done) =>{
    //         req.post(`${HOST_API}broadcast/live`, {form:{link:'http://www.naver.com/'}}, (err, res, body)=>{
    //             const _body = JSON.parse(body);
    //             expect(res.statusCode).to.equal(200);
    //             expect(_body.success).to.be.true;
    //             done();
    //         });
    //     });
    // });
    //
    // describe('Broadcast modify', () => {
    //     it('/broadcast/live', (done) =>{
    //         req.put(`${HOST_API}broadcast/live`, {form:{id:18}}, (err, res, body)=>{
    //             const _body = JSON.parse(body);
    //             expect(res.statusCode).to.equal(200);
    //             expect(_body.success).to.be.true;
    //             done();
    //         });
    //     });
    // });
    
    describe('Contents representative List', ()=>{
        it('/contents/representative', (done)=>{
            req.get(`${HOST_API}contents/representative`, (err, res, body)=>{
                const _body = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(_body.success).to.be.true;
                done();
            });
        });
    });
    
    describe('Contents education List', ()=>{
        it('/contents/education', (done)=>{
            req.get(`${HOST_API}contents/education`, (err, res, body)=>{
                const _body = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(_body.success).to.be.true;
                done();
            });
        });
    });
    
    describe('Contents summary List', ()=>{
        it('/contents/summary', (done)=>{
            req.get(`${HOST_API}contents/summary`, (err, res, body)=>{
                const _body = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(_body.success).to.be.true;
                done();
            });
        });
    });
    
    describe('Contents recommend List', ()=>{
        it('/contents/recommend', (done)=>{
            req.get(`${HOST_API}contents/recommend`, (err, res, body)=>{
                const _body = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(_body.success).to.be.true;
                done();
            });
        });
    });
    
});