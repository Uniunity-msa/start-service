"use strict"

const University = require("../models/University");
//const Partner = require("../models/Partner");
// const User = require("../models/User");
// const Council = require("../models/Council");
// const Post = require("../models/Post");
// const sendEmailWithAuthorization = require("../../mailer");
// const bcrypt = require('bcrypt');
// const Comment = require('../models/Comment');
// const { getLatestPosts } = require("../public/js/post/post");

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
    getUniversityLocation: async (req, res) => {
        try {
            const university_url = req.body.university_url;

            // RabbitMQ로 university_location 요청 및 수신
            await sendUniversityURL(university_url, 'SendUniversityLocation');
            const university_location = await receiveUniversityData('RecvStartUniversityLocation');
            console.log("partnerUpload university_location: ", university_location);
            return res.json(university_location);

        } catch (err) {
            console.error('getUniversityLocation error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getUniversityName: async (req, res) => {
        try {
                const university_url = req.body.university_url;

                await sendUniversityURL(university_url, 'SendUniversityName');
                const data = await receiveUniversityData('RecvStartUniversityName')

                console.log("partnerUpload university_name: ", data.university_name);
                return res.json(data.university_name);
        }catch (err) {
                console.error('getUniversityName error:', err);
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
