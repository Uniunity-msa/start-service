const express =require("express");
const router = express.Router();
const cors = require('cors');


const ctrl = require("./home.ctrl");

router.get("/mainPage",ctrl.output.home);
router.get("/council",ctrl.output.council);

//학교 라우터
// router.get("/showUniversityNameList/:university_name",ctrl.output.showUniversityNameList);
// router.get("/showUniversityNameList",ctrl.output.showUniversityNameList);


//post 라우터
// router.get("/postAll/:university_url",ctrl.post.postAll); //전체게시글 불러오기 API
// router.get("/postform/:university_url",ctrl.output.postform);
// router.get("/postviewer/:post_id",ctrl.output.postviewer);
// router.get("postform/modify",ctrl.output.postformModify);


module.exports=router;