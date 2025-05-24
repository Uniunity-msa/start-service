"use strict"

const { pool } = require("../config/db");

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

    //이미지 정보 넘기
    static async loadImages(postId) {
	console.log("UniversityStorage의 loadImages");
        return new Promise((resolve, reject) => {
            pool.getConnection(async (err, connection) => {
                if(err) return reject(err);
                    
                try {
                    //post랑 통신해서 post_id, img_url 받아와야 해서 일단 하드코딩 해뒀음
                    const imageData = [
                        {
                            image_url: "https://storage.googleapis.com/uniunity_bucket/고양이이미지.png", 
                            post_id: 1
                        }, 
                        {
                            image_url: "https://storage.googleapis.com/uniunity_bucket/고양이이미지.png", 
                            post_id: 2
                        }, 
                        {
                            image_url: "https://storage.googleapis.com/uniunity_bucket/고양이이미지.png", 
                            post_id: 3
                        }
                    ];
                    resolve(imageData);
                    
                } catch (err) {
                    connection.release();
                    reject({ result: false, status: 500, err: `${err}` });
                }
            });
        });
    }

    //게시글 등록시 post이미지 저장(클라우드 스토리지 사용방식으로 변경)
    // static async saveImagePost(postId, postInfo, formattedDateTime) {
    //     return new Promise((resolve, reject) => {
    //     pool.getConnection(async (err, connection) => {
    //         if (err) return reject(err);
    
    //         try {
    //         const post_id = postId;
    
    //         // src="data:image/..." 태그에서 base64 이미지 추출
    //         const regex = /<img\s+src="([^"]+)"\s+alt="[^"]+"\s+contenteditable="false">/gi;
    //         const matches = postInfo.match(regex);
    
    //         if (!matches || matches.length === 0) {
    //             connection.release();
    //             return resolve({ result: true, status: 201 });
    //         }
    
    //         // 첫 번째 이미지만 처리 (여러 개 저장 원하면 반복문으로 확장 가능)
    //         const base64Image = matches[0].match(/src="([^"]+)"/)[1];
    //         const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    //         const buffer = Buffer.from(base64Data, "base64");
    
    //         const uploadedUrl = await uploadImageToGCS(buffer, `post_${post_id}.jpg`);
    
    //         const imageQuery = 'INSERT INTO PostImage(image_id, post_id, image_url, image_date) VALUES (?, ?, ?, ?);';
    //         connection.query(imageQuery, [null, post_id, uploadedUrl, formattedDateTime], (imageErr) => {
    //             connection.release();
    //             if (imageErr) {
    //             return reject({ result: false, status: 500, err: `${imageErr}` });
    //             }
    //             return resolve({ result: true, status: 201 });
    //         });
    //         } catch (err) {
    //         connection.release();
    //         reject({ result: false, status: 500, err: `${err}` });
    //         }
    //     });
    //     });
    // }


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
