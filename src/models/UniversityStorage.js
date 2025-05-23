"use strict"

const { pool } = require("../config/db");
const { uploadImageToGCS } = require("../utils/gcsUploader");

class UniversityStorage {
    //모든 대학 정보 가져오기
    static getUniversityName() {
        return new Promise(async (resolve, reject) => {

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('MySQL 연결 오류: ', err);
                    reject(err)
                }

                pool.query("SELECT university_name,university_url,university_id FROM University ORDER BY university_name ASC;", function (err, rows, fields) {
                    pool.releaseConnection(connection);
                    if (err) {
                        console.error('Query 함수 오류', err);
                        reject(err)
                    }
                    resolve({success:true,status:200,result:rows});
                })
            })
        })
    }

    static getUnversityUrlToName(university_url) {
        console.log("UniversityStorage.js의 getUnversityUrlToName")
	return new Promise(async (resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('getUnversityName MySQL 연결 오류: ', err);
                    reject(err)
                }
                const query = "SELECT university_name FROM University WHERE university_url =?;";
                pool.query(query, [university_url], (err, data) => {
                    connection.release();
                    if (err) reject(`${err}`);

                    else {
                        resolve(data[0].university_name);
                    }
                });
            })
        })
    }


    // university_id받아 university_name반환하기
    // static getUnversityName(university_id) {
    //     return new Promise(async (resolve, reject) => {
    //         pool.getConnection((err, connection) => {
    //             if (err) {
    //                 console.error('getUnversityName MySQL 연결 오류: ', err);
    //                 reject(err)
    //             }
    //             const query = "SELECT university_name FROM University WHERE university_id =?;";
    //             pool.query(query, [university_id], (err, data) => {
    //                 connection.release();
    //                 if (err) reject(`${err}`);

    //                 else {
    //                     resolve(data[0].university_name);
    //                 }
    //             });
    //         })
    //     })
    // }

    // // university_id받아 university_url반환하기
    // static getUnversityUrl(university_id) {
    //     return new Promise(async (resolve, reject) => {
    //         pool.getConnection((err, connection) => {
    //             if (err) {
    //                 console.error('getUnversityUrl MySQL 연결 오류: ', err);
    //                 reject(err)
    //             }
    //             const query = "SELECT university_url FROM University WHERE university_id =?;";
    //             pool.query(query, [university_id], (err, data) => {
    //                 connection.release();
    //                 if (err) reject(`${err}`);

    //                 else {
    //                     resolve(data[0].university_url);
    //                 }
    //             });
    //         })
    //     })
    // }

    // static getUniversityNameList() {
    //     return new Promise(async (resolve, reject) => {

    //         pool.getConnection((err, connection) => {
    //             if (err) {
    //                 console.error('getUniversityNameList MySQL 연결 오류: ', err);
    //                 reject(err)
    //             }

    //             pool.query("SELECT university_name,university_url,university_id FROM University ORDER BY university_name ASC;", function (err, rows, fields) {
    //                 pool.releaseConnection(connection);
    //                 if (err) {
    //                     console.error('Query 함수 오류', err);
    //                     reject(err)
    //                 }
    //                 resolve({success:true,status:200,result:rows});
    //             })
    //         })
    //     })
    // }
}
module.exports = UniversityStorage;
