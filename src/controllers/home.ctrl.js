"use strict"

const University = require("../models/University");
const { sendUniversityURL, sendUniversityID, receiveUniversityData } = require('../rabbit/rabbitMQ');

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
    getUniversityID: async (req, res) => {
        try {
            console.log("home.ctrl의 getUniversityID ");
            const university_url = req.body.university_url;
            await sendUniversityURL(university_url, 'SendUniversityID');
            const university_id = await receiveUniversityData('RecvStartUniversityID');
	    console.log("home: university id:", university_id);
            
	    await sendUniversityID(university_id, 'SendPostList');
            const post_info = await receiveUniversityData('RecvPostList');
            console.log('home post_info: ', post_info.post_info);
            const result = post_info.post_info;
            console.log('home result: ', result);

	    return res.json({result});
        } catch (err) {
            console.log("getUniversityID error", err);
            return res.status(500).json({ error: 'Internal Server Error' }); 
        }
    },

    getCardNewsImageUrl: async (req, res) => {
        console.log("home.ctrl의 getImages");
        const university_id = req.body.university_id;
        await sendUniversityID(university_id, 'SendPostList');

        const post_info = await receiveUniversityData('RecvPostList');
	    console.log("home: post info:", post_info);
        return post_info;
    },

    getUniversityName: async (req, res) => {
        try {
            console.log("home.ctrl의 getUniversityName ");
            const university_url = req.body.university_url;
            //rabbitMQ로 user-service에 university_name, id 요청
            await sendUniversityURL(university_url, 'SendUniversityName');

            //데이터 수신
            const university_name = await receiveUniversityData('RecvStartUniversityName');
            console.log("home: university name:", university_name.university_name);
            return res.json(university_name);

        } catch (err) {
            console.error('getUniversityName error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUniversityLocation: async (req, res) => {
        try { 
            console.log("home.ctrl의 getUniversityLocation ");
            const university_url = req.body.university_url;
            await sendUniversityURL(university_url, 'SendUniversityLocation');
            const university_location = await receiveUniversityData('RecvStartUniversityLocation');

            console.log("home: university location:", university_location);
            return res.json(university_location);
        } catch (err) {
            console.error('getUniversityLocation error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    output,
    mainpage, 
    council
};
