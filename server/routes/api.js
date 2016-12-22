const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
const request = require("request");
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data


let params = fs.readFileSync("parameters.JSON");
// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});
let db;
// Get all posts
router.get('/posts', (req, res) => {
    MongoClient.connect('mongodb://' + params.username + ':' + params.password + '@ds141128.mlab.com:41128/rob-test', (err, database) => {
        if (err) return console.log(err);
        db = database;
        console.log(db);
    })
});
router.post('/classify', upload.array(), (req, userRes) => {
    let username, classifier, texts;

    // parse the received body data
    username = req.body.username;
    classifier = req.body.classifier;
    texts = req.body.texts.filter((val) => typeof val !== "undefined");
    console.log(texts);

    request.post(
        'https://api.uclassify.com' + '/v1/' + username + '/' + classifier + '/classify',
        {
            json: {texts: texts},
            headers: {Authorization: "Token LkVogjbE2b4h"},
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("body",body);
                userRes.json(body);
                userRes.end();
            } else if(error){
                userRes.json(error);
                console.log("error",error);
                userRes.end();
            } else if(response.statusCode == 500){
                console.log(response.body);
            }
        }
    );
});
module.exports = router;

/*
 xmlTest() {
 let xml2js = require('xml2js');
 let builder = require('xmlbuilder');
 let parseString = xml2js.parseString;


 let xml = builder.create('uclassify', {encoding: 'utf-8'})
 .att({'version': '1.01', 'xmlns': "http://api.uclassify.com/1/RequestSchema"})
 .ele('texts')
 .ele('textBase64', {'id': 'text_1'}, 'SSBhbSBoYXBweSBzYWQgYmFk').up()
 .up()
 .ele('readCalls', {readApiKey: this.apiKey})
 .ele('classify', {id: "call_1", username: "uClassify", classifierName: "Sentiment", textId: "text_1"}).up()
 .up()
 .end({pretty: true});
 this.http.post(this.url, xml,{headers:this.headers})
 .map((res) => res.json())
 .subscribe(
 (val) => parseString(val, (val) => console.log(val)),
 (err) => console.log(err)
 );

 }
 */
