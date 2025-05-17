"use strict"

//const Partner = require("../models/Partner");
// const User = require("../models/User");
// const Council = require("../models/Council");
const University = require("../models/University");
// const Post = require("../models/Post");
// const University = require("../models/University");
// const sendEmailWithAuthorization = require("../../mailer");
// const bcrypt = require('bcrypt');
// const Comment = require('../models/Comment');
// const { getLatestPosts } = require("../public/js/post/post");

const output = {
    home: (req, res) => {
        res.render('../views/mainpage.html');
    },
    council: (req, res) => {
        res.render('../views/council.html');
    }, 
}

const mainpage = {
    //테스트용
    home: async (req, res) => {
        res.render("mainpage.html");
    },

    showUniversityNameList: async (req, res) => {
        console.log("home.ctrl의 showUniversityNameList 실행\n");
        const university = new University(); //testGetUnversity
        const response = await university.testGetUnversity();
        return res.json(response);
    }
}

//council 페이지
const result = {
    council: async (req, res) => {
        res.render("council/council.html");
    },

    showUniversityNameList: async (req, res) => {
        const university_name = new University();
        const response = await university_name.showUniversityNameList();
        return res.json(response);
    },

    getUniversityName: async (req, res) => {
        const council = new Council();
        const response = await council.getUniversityName(req.body.university_url);
        return res.json(response);
    },

    getCardNewsImageUrl: async (req, res) => {
        const council = new Council();
        const response = await council.getUniversityID(req.body.university_url);
        const response2 = await council.getCardNewsImageUrl(response);
        return res.json(response2);
    },

    getUniversityLocation: async (req, res) => {
        const partner = new Partner();
        const university_id = await partner.getUniversityID(req.body.university_url);
        const response = await partner.getUniversityLocation(university_id);
        return res.json(response);
    },
}


module.exports = {
    output,
    // process,
    result,
    // partner,
    // post,
    // retailer,
    // comment
    mainpage
};