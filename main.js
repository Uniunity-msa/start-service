"use strict"

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const db = require('./src/config/db.js');
const app = express();
const mysql = require('mysql2/promise');
const amqp = require('amqplib');

//에러 라우팅
const errorController = require("./src/controllers/errorControllers.js");
require('dotenv').config();

const bcrypt = require('bcrypt');

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Readiness Probe용 엔드포인트: DB & RabbitMQ 연결 검사
app.get('/ready', async (req, res) => {
  try {
    const rabbitUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    const rabbitConn = await amqp.connect(rabbitUrl, { timeout: 2000 }); 
    // 채널을 열었다가 바로 닫으면 연결 상태 확인 가능
    const channel = await rabbitConn.createChannel();
    await channel.close();
    await rabbitConn.close();

    // 둘 다 성공하면 READY
    res.status(200).json({ status: 'READY' });
  } catch (err) {
    console.error('Readiness check failed:', err.message);
    res.status(500).json({ status: 'NOT_READY', error: err.message });
  }
});

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
app.use("/council/css", express.static(path.join(__dirname, "src/public/css")));
app.use("/council/js", express.static(path.join(__dirname, "src/public/js")));

app.use(bodyParser.json());
//URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./src/routes/startRoute.js")); //use -> 미들 웨어를 등록해주는 메서드

//에러처리를 위한 미들웨어 생성
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalEroor);

// const port = process.env.PORT;
const port = 3001;
app.listen(port, ()=> {
    console.log('running')
})

module.exports = app;
