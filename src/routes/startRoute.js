const express =require("express");
const router = express.Router();
const cors = require('cors');
const ctrl = require("../controllers/home.ctrl");

//메인페이지
router.get("/mainPage",ctrl.output.home);
router.get("/showUniversityNameList", ctrl.mainpage.showUniversityNameList);

//council 페이지
router.get("/council/:university_url", ctrl.output.council);
router.get("/council/:university_url/getUniversityName", ctrl.council.getUniversityName);

// council 라우터
// router.get("/council/:universityname",ctrl.result.council);
// router.get("/post/:universityname/:category",ctrl.output.post);
// router.post("/getUniversityName", ctrl.result.getUniversityName);
// router.post("/getCardNewsImageUrl", ctrl.result.getCardNewsImageUrl);

module.exports = router;
