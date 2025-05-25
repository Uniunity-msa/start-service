"use strict"

const University = require("../models/University");
const { sendUniversityURL, receiveUniversityData } = require('../rabbit/rabbitMQ');

const output = {
    home: (req, res) => {
        res.render('../views/mainpage.html');
    },
    council: (req, res) => {
        mainpage.getUniversityName;
        res.render('../views/council.html');
    }, 
}

const mainpage = {
    showUniversityNameList: async (req, res) => {
        console.log("home.ctrl의 showUniversityNameList 실행\n");
        const university = new University();
        const response = await university.showUniversityNameList();
        return res.json(response);
    }
}

//council 페이지
const council = {
    getImages: async (req, res) => {
        console.log("home.ctrl의 getImages");
        const university = new University();
	try {
	    const university_url = req.body.university_url;
            console.log("university_url: ", university_url);

            const response = await university.getImages(university_url);
            return res.json(response);
            //1. post-service랑 통신해서 post_img_id, img_url 가져오기
            //2. post_img_id로 클라우드 스토리지에서 이미지 가져오기

        } catch (err) {
            console.log("getImages error", err);
            return res.status(500).json({ error: 'Internal Server Error' }); 
        }
    },

    getUniversityName: async (req, res) => {
        try {
            console.log("home.ctrl의 getUniversityName ");
            const universtiy_url = req.body.university_url;
            //rabbitMQ로 user-service에 university_name, id 요청
            await sendUniversityURL(universtiy_url, 'SendUniversityName');
            await sendUniversityURL(universtiy_url, 'SendUniversityID');

            //데이터 수신
            const university_name = await receiveUniversityData('RecvStartUniversityName');
            const university_id = await receiveUniversityData('RecvStartUniversityID');
            console.log("home: university name:", university_name);
            return res.json({university_name, university_id});

        } catch (err) {
            console.error('getUniversityName error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        //rabbitmq 적용 전 코드
        // console.log("home.ctrl의 getUniversityName ");
        // const university = new University();
	
        // if (!req.body || !req.body.university_url) {
        //     console.error("❌ university_url이 전달되지 않았습니다.");
        //     return res.status(400).json({ error: "university_url이 필요합니다." });
        // }

        // const response = await university.getUnversityUrlToName(req.body.university_url);
        // console.log(response);
        // return res.json(response);
    },

    getUniversityLocation: async (req, res) => {
        console.log("home.ctrl의 getUniversityLocation");
        console.log("req.body:", req.body);
	try {
            const university_url = req.body.university_url;

            // RabbitMQ로 university_location 요청 및 수신
            await sendUniversityURL(university_url, 'SendUniversityLocation');
            const university_location = await receiveUniversityData('RecvUniversityLocation');

            return res.json(university_location);

        } catch (err) {
            console.error('getUniversityLocation error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

//     showUniversityNameList: async (req, res) => {
//         const university_name = new University();
//         const response = await university_name.showUniversityNameList();
//         return res.json(response);
//     },

//     getUniversityName: async (req, res) => {
//         const council = new Council();
//         const response = await council.getUniversityName(req.body.university_url);
//         return res.json(response);
//     },

//     getCardNewsImageUrl: async (req, res) => {
//         const council = new Council();
//         const response = await council.getUniversityID(req.body.university_url);
//         const response2 = await council.getCardNewsImageUrl(response);
//         return res.json(response2);
//     },

//     getUniversityLocation: async (req, res) => {
//         const partner = new Partner();
//         const university_id = await partner.getUniversityID(req.body.university_url);
//         const response = await partner.getUniversityLocation(university_id);
//         return res.json(response);
//     },
// }


module.exports = {
    output,
    mainpage, 
    council
};
