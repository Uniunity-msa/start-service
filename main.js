"use strict"

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const db = require('./src/config/db.js');
const app = express();

//에러 라우팅
const errorController = require("./src/controllers/errorControllers.js");
require('dotenv').config();

//const bcrypt = require('bcrypt');

// 앱 셋팅
// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.
app.set("views", "./src/views");
// 서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정합니다.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '<% %>' });

// 스타일(CSS) 적용하기
//static 파일 url로 접근할 수 있도록 
//app.use(express.static(`${__dirname}/src/public`));
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(bodyParser.json());
//URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결

app.use(bodyParser.urlencoded({ extended: true }));


// app.use("/", require("./src/controllers/index.js")); //use -> 미들 웨어를 등록해주는 메서드
app.use("/", require("./src/routes/startRoute.js")); //use -> 미들 웨어를 등록해주는 메서드

//에러처리를 위한 미들웨어 생성

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalEroor);

// //rabbitMQ test
// const amqp = require("amqplib");
// const RABBIT = process.env.RABBIT;
// function connectRabbit() {

//     console.log(`Connecting to RabbitMQ server at ${RABBIT}.`);

//     return amqp.connect(RABBIT) // Connect to the RabbitMQ server.
//         .then(messagingConnection => {
//             console.log("Connected to RabbitMQ.");

//             return messagingConnection.createChannel(); // Create a RabbitMQ messaging channel.
//         });
// }

// function main() {
//     console.log("Hello world!");

//     return connectDb()                                          // Connect to the database...
//         .then(db => {                                           // then...
//             return connectRabbit()                              // connect to RabbitMQ...
//                 .then(messageChannel => {                       // then...
//                     return startHttpServer(db, messageChannel); // start the HTTP server.
//                 });
//         });
// }
// main()
//     .then(() => console.log("Microservice online."))
//     .catch(err => {
//         console.error("Microservice failed to start.");
//         console.error(err && err.stack || err);
//     });
//rabbitMQ test

// const port = process.env.PORT;
const port = 3001;
app.listen(port, ()=> {
    console.log('running')
})


module.exports = app;
