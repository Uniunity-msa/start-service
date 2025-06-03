"use strict"

const { sendUniversityURL, sendUniversityID, receiveUniversityData } = require('../rabbit/rabbitMQ');

const output = {
    home: (req, res) => {
        res.render('../views/mainpage.html');
    },
    council: (req, res) => {
        res.render('../views/council.html');
    }, 
}

//council 페이지
const council = {
    //간접통신으로 학교 이름 가져오기
    getUniversityName: async (req, res) => {
        try {
            console.log("home getUniversityName 시작");
            const university_url = req.body.university_url;
            console.log("home getUniversityName university_url: ", university_url);
            //rabbitMQ로 user-service에 university_name, id 요청
            await sendUniversityURL(university_url, 'SendUniversityName');

            //데이터 수신
            const university_name = await receiveUniversityData('RecvStartUniversityName');
            console.log("home getUniversityName result: ", university_name);
            return res.json(university_name);

        } catch (err) {
            console.error('getUniversityName error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    //통신해서 학교id, image_url, post_id 가져오기
    getUniversityID: async (req, res) => {
        try {
            console.log("home getUniversityName 시작");
            const university_url = req.body.university_url;
            console.log("home getUniversityName university_url: ", university_url);
            await sendUniversityURL(university_url, 'SendUniversityID');
            const university_id = await receiveUniversityData('RecvStartUniversityID');
            
            if(university_id == null) {
                console.log("id를 받아오지 못했습니다.");
                return res.status(500).json({ error: 'Internal Server Error' }); 
            }

            console.log("home getUniversityName university_id: ", university_id);
            await sendUniversityID(university_id, 'SendPostList');
            const post_info = await receiveUniversityData('RecvPostList');
            const result = post_info.post_info;
            
            console.log("home getUniversityName result: ", result);
            return res.json({result});
        } catch (err) {
            console.log("getUniversityID error", err);
            return res.status(500).json({ error: 'Internal Server Error' }); 
        }
    },

    getUniversityLocation: async (req, res) => {
        try { 
            console.log("home.ctrl의 getUniversityLocation ");
            const university_url = req.body.university_url;
            console.log("home getUniversityName university_url: ", university_url);
            await sendUniversityURL(university_url, 'SendUniversityLocation');
            const university_location = await receiveUniversityData('RecvStartUniversityLocation');

            console.log("home getUniversityName university_location: ", university_location);
            return res.json(university_location);
        } catch (err) {
            console.error('getUniversityLocation error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}


module.exports = {
    output,
    council
};
