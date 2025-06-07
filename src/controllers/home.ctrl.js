"use strict"

const { sendUniversityURL, sendUniversityID, receiveUniversityData, generateCorrelationId, receivePostData } = require('../rabbit/rabbitMQ');

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
            const university_url = req.body.university_url;
            const correlationId = generateCorrelationId();
            //rabbitMQ로 user-service에 university_name, id 요청
            await sendUniversityURL(university_url, 'SendUniversityName', correlationId);
            //데이터 수신
            const university_name = await receiveUniversityData('RecvStartUniversityName', correlationId);
            console.log("getUniversityName => university_name: ", university_name);
            return res.json(university_name);

        } catch (err) {
            console.error('getUniversityName error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    //통신해서 학교id, image_url, post_id 가져오기
    getUniversityID: async (req, res) => {
        try {
            const university_url = req.body.university_url;
            const correlationId = generateCorrelationId();
            await sendUniversityURL(university_url, 'SendUniversityID', correlationId);
            const university_id = await receiveUniversityData('RecvStartUniversityID', correlationId);
            console.log("getUniversityID => university_id: ", university_id);
            
            if(university_id == null) {
                console.error("id를 받아오지 못했습니다.");
                return res.status(500).json({ error: 'Internal Server Error' }); 
            }

            await sendUniversityID(university_id.university_id, 'SendPostList');
            const post_info = await receivePostData('RecvPostList');
            console.log("getUniversityID => post_info: ", post_info);
            const result = post_info.post_info;
            
            return res.json({result});
        } catch (err) {
            console.error("getUniversityID error", err);
            return res.status(500).json({ error: 'Internal Server Error' }); 
        }
    },

    getUniversityLocation: async (req, res) => {
        try { 
            const university_url = req.body.university_url;
            const correlationId = generateCorrelationId();
            await sendUniversityURL(university_url, 'SendUniversityLocation', correlationId);
            const university_location = await receiveUniversityData('RecvStartUniversityLocation', correlationId);
            console.log("getUniversityLocation => university_location: ", university_location);

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
