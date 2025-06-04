const ul = document.querySelector(".pop_rel_keywords");
const searchInput = document.querySelector(".search_input");
const relContainer = document.querySelector(".rel_search");
import { apiUrl, baseUrls } from '/council/js/apiUrl.js';

//로그인(로그아웃), 회원가입(마이페이지)버튼
const loginStatusBtn=document.getElementById("loginStatusBtn");
const signUpBtn=document.getElementById("signUpBtn");
const navBar=document.getElementById("navbar-brand");

let universitySearchList = [];

//========== 학교 이름들을 화면에 띄우기 ==========
const searchUniversityName = (suggestArr) => {
    ul.innerHTML = "";
    suggestArr.forEach((el, idx) => {
        // el : {universityname : "성신여자대학교"}
        universitySearchList.push(el);
        }
    )
}

const loadUnivesrsityData = async () => {
    const res = await fetch(`${baseUrls.university}/findAllUniversityName`);
    const data = await res.json();
    if (res.ok) {
        searchUniversityName(data.result);  // 리스트 저장
        return;
    } else {
        ul.innerHTML = "<li>서버 오류로 점검 중입니다. 잠시 후 이용해주세요.</li>";
    }
};

//========== 로그인 로그아웃 ==========
const handleLogout = async () => {
    try {
        const res = await fetch(`${baseUrls.auth}/logout`, {
        method: "POST",
        credentials: "include"
        });

        if (res.ok) {
        // 로그아웃 성공 시 페이지 새로고침F
        window.location.reload(); // 또는 window.location.href = "/";
        } else {
            const data = await res.json();
            alert(data.message || "로그아웃에 실패했습니다.");
        }
    } catch (err) {
        console.error("로그아웃 요청 중 오류 발생:", err);
        alert("서버 오류로 로그아웃에 실패했습니다.");
    }
};

// 작성자 회원 정보 불러오기
const loadloginData = async () => {
  const res = await fetch(`${baseUrls.auth}/me`, {
    credentials: "include", // 쿠키 포함
  });
  if (res.ok == true){
    loginStatusBtn.innerText = "로그아웃"
    loginStatusBtn.removeAttribute("href"); // 기본 링크 제거
    loginStatusBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 링크 동작 막기
      handleLogout();     // 로그아웃 요청
    });
    signUpBtn.setAttribute("href", `${baseUrls.postReaction}/mypage`);
    signUpBtn.innerText = "마이페이지"
  } else {
    loginStatusBtn.setAttribute("href", `${baseUrls.auth}/login`);
    loginStatusBtn.innerText = "로그인"
    signUpBtn.setAttribute("href", `${baseUrls.user}/agreement`);
    signUpBtn.innerText = "회원가입"
  }
  const data = await res.json();
  userInfo = data; 
};

//mainpage 로드 후 loadData()실행
window.addEventListener('DOMContentLoaded', function() {
    loadUnivesrsityData();
    loadloginData();
});

//========== 클릭하면 학교리스트 보여주기 ==========
const checkInput = () => {

    const input = searchInput.value;
    while(ul.hasChildNodes()){
        ul.removeChild(ul.firstChild);
    }
    if(input==""){ //input이 빈문자열일 경우에 모든 학교리스트 반환(keyup)
        universitySearchList.forEach((el)=>{
            const li=document.createElement("li");
                const a = document.createElement("a");
                ul.appendChild(li);
                li.appendChild(a);
                a.innerHTML=el.university_name;
                a.href=`/council/${el.university_url}`;
        })
    }
    else{
        universitySearchList.forEach((el) => {
            if (el.university_name.indexOf(input) >= 0) {
                const li=document.createElement("li");
                const a = document.createElement("a");
                ul.appendChild(li);
                li.appendChild(a);
                a.innerHTML=el.university_name;
                a.href=`/council/${el.university_url}`;
            }
        })
    }
}
searchInput.addEventListener("keyup", checkInput);

 //input이 빈 문자열일 경우에 모든 학교리스트 반환(mousedown)
searchInput.addEventListener("mousedown", (event) => {
    while(ul.hasChildNodes()){
        ul.removeChild(ul.firstChild);
    }
    universitySearchList.forEach((el)=>{
        const li=document.createElement("li");
            const a = document.createElement("a");
            ul.appendChild(li);
            li.appendChild(a);
            a.innerHTML=el.university_name;
            a.href=`/council/${el.university_url}`;
    })
});