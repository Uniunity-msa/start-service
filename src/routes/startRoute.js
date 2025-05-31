const express =require("express");
const router = express.Router();
const ctrl = require("../controllers/home.ctrl");

//메인페이지
router.get("/mainPage",ctrl.output.home);

//council 페이지
router.get("/council/:university_url", ctrl.output.council);
router.post("/getUniversityName", ctrl.council.getUniversityName);
router.post("/getUniversityID", ctrl.council.getUniversityID);

module.exports = router;
