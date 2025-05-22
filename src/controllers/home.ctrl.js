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
<<<<<<< Updated upstream
    }
=======
    } 
>>>>>>> Stashed changes
}

//council 페이지
const council = {
    getUniversityName: async (req, res) => {
        console.log("home.ctrl의 getUniversityName ");
<<<<<<< Updated upstream
        const council = new Council();
        const response = await council.getUniversityName(req.body.university_url);
=======
        const university = new University();
        const response = await university.getUniversityName(req.body.university_url);
>>>>>>> Stashed changes
        console.log(response);
        return res.json(response);
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
