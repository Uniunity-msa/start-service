const express =require("express");
const router = express.Router();
const cors = require('cors');
const ctrl = require("../controllers/home.ctrl");

//메인페이지
router.get("/mainPage",ctrl.output.home);
router.get("/showUniversityNameList", ctrl.mainpage.showUniversityNameList);

//council 페이지
router.get("/council/:university_url",ctrl.output.council, ctrl.mainpage.getUniversityName);


module.exports = router;
