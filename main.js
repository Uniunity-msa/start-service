"use strict"

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
// const Multer=require('multer');
// const FirebaseStorage = require('multer-firebase-storage');

const app = express();

//에러 라우팅
const errorController = require("./src/controllers/errorControllers.js");
require('dotenv').config();

// //세션이용
// var session = require('express-session')
// //세션을 파일에 저장
// var FileStore = require('session-file-store')(session)
// //로그인 기능 
// const User = require("./src/models/User");

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


//passport는 세션을 내부적으로 사용하기 때문에 express-session을 활성화 시키는 코드 다음에 등장해야한다.!!

// var passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy;

// //passport를 설치한 것이고 express가 호출이 될 때마다 passport.initalize가 호출되면서 우리의 app에 개입됨
// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, done) {
//   done(null, user.user_email);
// });

// passport.deserializeUser(function (id, done) {
//   done(null, id);
// });

// let userInfo;
// passport.use(new LocalStrategy(
//   {
//     usernameField: 'email',
//     passwordField: 'pwd'
//   },
//   async function (username, password, done) {

//     let user = new User();
//     userInfo = await user.getUserInfo(username);
//     if (!userInfo) {
//       return done(null, false, {
//         reason: '등록된 이메일이 없습니다.'
//       });
//     }

//     if (username === userInfo.user_email) {
//       if (await bcrypt.compare(password, userInfo.psword)) {
//         return done(null, userInfo);
//       } else {
//         return done(null, false, {
//           reason: '비밀번호가 틀렸습니다.'
//         });
//       }
//     } else {
//       return done(null, false, {
//         reason: '등록된 이메일이 없습니다.'
//       });
//     }
//   }
// ));


app.use("/", require("./src/controllers/index")); //use -> 미들 웨어를 등록해주는 메서드

//에러처리를 위한 미들웨어 생성

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalEroor);

const port = 3000
app.listen(port, ()=> {
    console.log('running')
})


module.exports = app;