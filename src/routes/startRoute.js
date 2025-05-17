const express =require("express");
const router = express.Router();
const cors = require('cors');
const ctrl = require("../controllers/home.ctrl");

router.get("/mainPage",ctrl.output.home);
router.get("/council",ctrl.output.council);

router.get("/showUniversityNameList", ctrl.result.showUniversityNameList);

module.exports = router;