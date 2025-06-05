import loadKakaoMap from '/council/js/kakaomapLoader.js';
import apiKeys from '/council/js/apiKey.js';
import { apiUrl, baseUrls } from '/council/js/apiUrl.js';

// ========== 로그인 로그아웃 ==========
//로그인(로그아웃), 회원가입(마이페이지)버튼
//auth 로그인 정보 가져오기
const loginStatusBtn = document.getElementById("loginStatusBtn");
const signUpBtn = document.getElementById("signUpBtn");
let userInfo;

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    const res = await fetch(`${baseUrls.auth}/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      // 로그아웃 성공 시 페이지 새로고침
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

// university_url 값을 받아오는 함수
function getUniversityUrl() {
  const url = new URL(window.location.href);
  const universityUrl = url.pathname.split('/').pop();
  return universityUrl;
}
var current_university_url = getUniversityUrl();

function setCenter(map,latitude,longitude){            
  // 이동할 위도 경도 위치를 생성합니다 
  var moveLatLon = new kakao.maps.LatLng(latitude,longitude);
  
  // 지도 중심을 이동 시킵니다
  map.setCenter(moveLatLon);
}

const serviceKey = apiKeys.SERVICE_KEY;
const endPoint = apiKeys.ENDPOINT;

document.addEventListener("DOMContentLoaded", async () => {
    var university_location = [];
    const universityUrl = current_university_url;
    const req = {
      university_url: universityUrl
    };

    try {
      const res = await fetch(`${apiUrl}/getUniversityLocation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify(req),
      });

      const data = await res.json();
      university_location[0] = data.latitude;
      university_location[1] = data.longitude;
    } catch (err) {
      console.error("지도 정보 요청 중 에러:", err);
      university_location[0] = 37.59169598260442; //초기위치
      university_location[1] = 127.02220971655647;
    }
    
    loadKakaoMap().then(() => {
      const container = document.getElementById('map');
      if (!container) return console.error('#map 요소가 없습니다.');
  
      let map;
      map = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(university_location[0], university_location[1]), // 초기 위치
          level: 3
        });

      kakao.maps.event.addListener(map, 'bounds_changed', () => {
        const bounds = map.getBounds();
        const swLatlng = bounds.getSouthWest();
        const neLatlng = bounds.getNorthEast();
  
        const minx = swLatlng.La.toString();
        const miny = swLatlng.Ma.toString();
        const maxx = neLatlng.La.toString();
        const maxy = neLatlng.Ma.toString();
  
        const url = `${endPoint}storeListInRectangle?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&minx=${minx}&miny=${miny}&maxx=${maxx}&maxy=${maxy}&type=json`;
  
        const stores = [];
        const positions = [];
        
        fetch(url)
          .then(res => res.json())
          .then(res => {
            for (let i = 0; i < res.body.items.length; i++) {
              const item = res.body.items[i];
              stores.push({
                storeName: item.bizesNm,
                store_location: item.rdnmAdr,
                storeClass: item.indsLclsNm,
                storeItem: item.indsSclsNm,
                ksicNm: item.ksicNm
              });
              positions.push(new kakao.maps.LatLng(item.lat, item.lon));
            }
  
            for (let i = 0; i < positions.length; i++) {
              const marker = new kakao.maps.Marker({
                map: map,
                position: positions[i]
              });
  
              kakao.maps.event.addListener(marker, 'click', () => {
                for (let i = 0; i < storeInfoTextBox.length; i++) {
                  storeInfoTextBox[i].style.display = "block";
                }
                storeName.innerHTML = stores[i].storeName;
                storeAdr.innerHTML = stores[i].store_location;
                storeClass.innerHTML = `${stores[i].storeClass} ${stores[i].storeItem}`;
                storeItem.innerHTML = stores[i].ksicNm;
              });
            }
          })
          .catch(err => {
            console.error("API 요청 실패", err);
          });
      });
    }).catch((err) => {
      console.error("Kakao Map 로드 실패", err);
    });
  });

// 슬라이더 정보
var mySwiper;
function setSwiper() {
  mySwiper = new Swiper('.swiper-container', {
  wrapperClass: 'swiper-wrapper',
  slideClass: 'swiper-slide',
  navigation: {
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next',
  },
  loop: true,
  slidesPerView: 3,
  centerSlides: true,
  spaceBetween: 20,
});
}

const universityName = document.querySelector("#universityName");

var Uniname = [];
var current_university_id;
var imageUrls = [];

// 카드뉴스 이미지 추가 함수
async function fetchImageUrls(imageData) {
  try {
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    // 이미지 데이터 배열인지 확인
    if (Array.isArray(imageData)) {
      // imageData 배열을 역순으로 순회하며 이미지를 카루셀에 추가
      // for (let i = imageData.length - 1; i >= 0; i--) {
        for (let i = 0; i <= imageData.length - 1; i++) {
        const currentData = imageData[i]; // 현재 이미지 데이터
        // 이미지 데이터의 형태가 객체인지 확인
        if (currentData && currentData.img_url) {
          imageUrls.push(currentData.img_url); // 이미지를 배열에 추가

          const imgContainer = document.createElement('div');
          imgContainer.classList.add('swiper-slide');

          const imgLink = document.createElement('a');
          imgLink.href = `${baseUrls.post}/postviewer/${currentData.post_id}`; // 이미지 클릭 시 postviewer 페이지로 이동하는 URL 생성
          imgLink.target = '_self';

          const imgElement = document.createElement('img');
          imgElement.classList.add('news');
          imgElement.src = currentData.img_url;
          imgElement.alt = 'no_image' + imageUrls.length;

          imgLink.appendChild(imgElement);
          imgContainer.appendChild(imgLink);
          swiperWrapper.appendChild(imgContainer);
        }
      }
    } else {
      console.error('Error: imageData is not an array or is empty.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

//user-service와 통신해서 학교 이름 얻어오기
function nameLoad() {
  const universityUrl = current_university_url;
  const req = {
    university_url: universityUrl
  };

  fetch(`${apiUrl}/getUniversityName`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then(res => {
      console.log("학교 이름: ", res.university_name);
      Uniname.push(res.university_name);
      universityName.innerHTML = Uniname[0];
    });
}

//user, post-service와 통신해서 학교 아이디 게시글 정보 얻어오기
function imageLoad() {
  const universityUrl = current_university_url;
  const req = {
    university_url: universityUrl
  };

  fetch(`${apiUrl}/getUniversityID`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
  .then((res) => res.json())
  .then((data) => {
      fetchImageUrls(data.result);
  });
}

window.addEventListener('DOMContentLoaded', function() {
  setSwiper();
  updateDynamicLinks();
  loadloginData();
  nameLoad();
  imageLoad();
});


var swiperContainer = document.querySelector('.swiper-container');

// 슬라이더 버튼
var prevButton = document.querySelector('.swiper-button-prev');
var nextButton = document.querySelector('.swiper-button-next');

function updateSwiper() {
  if (mySwiper) {
      mySwiper.update(); // 스와이퍼 업데이트 메서드 호출
  }
}

// 다음 버튼 클릭시
nextButton.addEventListener('click', function () {
  slideToNext();
  updateSwiper();
});

// 이전 버튼 클릭시
prevButton.addEventListener('click', function () {
  slideToPrev();
  updateSwiper();
});

// slideToNext() 함수 정의
function slideToNext() {
  mySwiper.slideNext();
}

// slideToPrev() 함수 정의
function slideToPrev() {
  mySwiper.slidePrev();
}
// document.getElementById("moreUni").addEventListener("click", function(event) {
//   event.preventDefault(); // 기본 동작인 링크 이동을 막음
//   window.location.href = `${apiUrl}`; // 이동할 링크를 지정
// });

// 버튼 요소를 가져옵니다.
const button = document.getElementById('universityName');

// 버튼에 클릭 이벤트를 추가합니다.
button.addEventListener('click', () => {
  // 페이지를 다시 로드합니다.
  location.reload();
});

// 현재 URL의 경로 일부 가져오기 (council 뒤의 학교 이름 추출함)
function getDynamicValueFromURL() {
  var path = window.location.pathname;
  var regex = /\/council\/([a-zA-Z]+)/; // /council/ 다음에 있는 영어 문자열을 추출하는 정규식
  var matches = path.match(regex);
  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return null;
  }
}

// 새로운 url 만들기
function generateDynamicURL(linkId, userschool) {
  var dynamicValue;
  var next_url;

  // linkId에 따라 동적 값을 할당하는 로직을 구현합니다.
  if (linkId === "retailer") {
    dynamicValue = userschool;
    next_url = baseUrls.retailer;
  } else if (linkId === "partner") {
    dynamicValue = userschool;
    next_url = baseUrls.partner;
  } else if (linkId === "more_news") {
    dynamicValue = "all/" + userschool;
    next_url = baseUrls.post;
  } else if (linkId === "more_retailer") {
    dynamicValue = userschool;
    next_url = baseUrls.retailer;
  } else if (linkId === "news") {
    dynamicValue = "all/" + userschool;
    next_url = baseUrls.post;
  } else if (linkId === "contact") {
    dynamicValue = "contact/";
    next_url = baseUrls.postReaction;
  }

  return `${next_url}/` + dynamicValue;
}

// 새로운 url로 업데이트
async function updateDynamicLinks() {
  var userschool = getDynamicValueFromURL();
  if (!userschool) {
    console.log("영어 문자열이 URL에서 추출되지 않았습니다.");
    return;
  }

  var link1 = document.getElementById("main_retailer");
  var link2 = document.getElementById("partner");
  var link3 = document.getElementById("news");
  var link4 = document.getElementById("more_news");
  var link5 = document.getElementById("more_retailer");

  link1.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("retailer", userschool);
    window.location.href = link;
  });

  link2.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("partner", userschool);
    window.location.href = link;
  });

  link3.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("news", userschool);
    window.location.href = link;
  });

  link4.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("more_news", userschool);
    window.location.href = link;
  });

  link5.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("more_retailer", userschool);
    window.location.href = link;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  var logo = document.getElementById("navbar");
  if (logo) {
    logo.setAttribute("href", `${baseUrls.mainpage}`);
  }

  var contact = document.getElementById("contact");
  if (contact) {
    contact.setAttribute("href", `${baseUrls.postReaction}/mypage/contact`);
  }
});