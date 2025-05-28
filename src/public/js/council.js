import loadKakaoMap from '/js/kakaomapLoader.js';
import apiKeys from './apiKey.js';
import { apiUrl } from '/js/apiUrl.js';
import { baseUrls } from './apiUrl.js';

//로그인(로그아웃), 회원가입(마이페이지)버튼
const loginStatusBtn = document.getElementById("loginStatusBtn");
const signUpBtn = document.getElementById("signUpBtn");

const user_email = document.getElementById("user_email");
const user_nickname = document.getElementById("user_nickname");
const user_type = document.getElementById("user_type");
const user_name = document.getElementById("user_name");
const university_name = document.getElementById("university_name");
const navBar=document.getElementById("navbar");

//auth 로그인 정보 가져오기
let userInfo;
const userApiUrl = baseUrls.user;

const loadloginData = async () => {
  const res = await fetch(`${userApiUrl}/auth/logout`, {
    credentials: "include", // 쿠키 포함
  });

  userInfo = await res.json(); // 유저 정보가 저장되는 변수
};

// 페이지 로드 후 로그인 정보 획득
window.addEventListener('DOMContentLoaded', function () {
    loadloginData();
});

//회원로그인 정보 불러오기
// const loadloginData = () => {
//   const url = `${apiUrl}/loginStatus`;
//   fetch(url)
//       .then((res) => res.json())
//       .then(res => {
//           userInfo=res;
//           setLoginHeader(res);
//       }
//       )
// }

// const setLoginHeader = (res) => {
//   navBar.setAttribute("href", `${apiUrl}`);
//   if (res.loginStatus) {
//       loginStatusBtn.setAttribute("href", `${apiUrl}/logout`);
//       loginStatusBtn.innerText = "로그아웃"
//       signUpBtn.setAttribute("href", `${apiUrl}/mypage`);
//       signUpBtn.innerText = "마이페이지"
//   }
//   else {
//       loginStatusBtn.setAttribute("href", `${apiUrl}/login`);
//       loginStatusBtn.innerText = "로그인"
//       signUpBtn.setAttribute("href", `${apiUrl}/signup/agreement`);
//       signUpBtn.innerText = "회원가입"
//   }

// }


// university_url 값을 받아오는 함수
function getUniversityUrl() {
  // 현재 페이지의 URL에서 경로(pathname) 부분을 추출
  const path = window.location.pathname;

  // 경로에서 universityUrl 값을 추출
  const pathParts = path.split('/');
  const universityUrl = pathParts[pathParts.length - 1];
  console.log("universityUrl: ", universityUrl);
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

document.addEventListener("DOMContentLoaded", () => {
    loadKakaoMap().then(() => {
      const container = document.getElementById('map');
      if (!container) return console.error('#map 요소가 없습니다.');
  
      const map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(37.59169598260442, 127.02220971655647), // 초기 위치
        level: 3
      });
      
      // setCenter();
      // bounds_changed 이벤트 등록
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
  console.log('fetchImageUrls 시작');
  try {
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    //console.log('Received imageData:', imageData);

    // 이미지 데이터 배열인지 확인
    if (Array.isArray(imageData)) {
      // imageData 배열을 역순으로 순회하며 이미지를 카루셀에 추가
      // for (let i = imageData.length - 1; i >= 0; i--) {
        for (let i = 0; i <= imageData.length - 1; i++) {
        const currentData = imageData[i]; // 현재 이미지 데이터
        // 이미지 데이터의 형태가 객체인지 확인
        if (currentData && currentData.image_url) {
          //console.log(imageUrls.length);
          imageUrls.push(currentData.image_url); // 이미지를 배열에 추가

          const imgContainer = document.createElement('div');
          imgContainer.classList.add('swiper-slide');

          const imgLink = document.createElement('a');
          imgLink.href = `${apiUrl}/postviewer/${currentData.post_id}`; // 이미지 클릭 시 postviewer 페이지로 이동하는 URL 생성
          imgLink.target = '_self';

          const imgElement = document.createElement('img');
          imgElement.classList.add('news');
          imgElement.src = currentData.image_url;
          imgElement.alt = 'no_image' + imageUrls.length;

          imgLink.appendChild(imgElement);
          imgContainer.appendChild(imgLink);
          swiperWrapper.appendChild(imgContainer);
        }
      }

      //console.log('Image URLs:', imageUrls);
    } else {
      console.error('Error: imageData is not an array or is empty.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function imagesLoadTest() {
  console.log("imagesLoadTest 시작"); //테스트용 로그
  const universityUrl = current_university_url;
  const req = {
    university_url: universityUrl
  };
  
  console.log("apiUrl: ", `${apiUrl}`); //테스트용 로그
  fetch(`${apiUrl}/getImages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((imageData) => {
      fetchImageUrls(imageData);
    })
}

function councilLoad() { //-> nameLoad
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
      console.log("councilLoad universityInfo: ", res);
      Uniname.push(res.university_name);
      universityName.innerHTML = Uniname[0];
    // console.log("council의 Uniname[0]: ", Uniname[0]); //테스트용 로그
    // console.log("council의 universityName: ", universityName.innerHTML); //테스트용 로그
    });
  //   .then(() => {
  //   return fetch(`${apiUrl}/getCardNewsImageUrl`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(req),
  //   });
  // })
  // .then((res) => res.json())
  // .then((imageData) => { // 이미지 데이터를 변수 imageData로 받아옴
  //   fetchImageUrls(imageData); // 이미지 데이터를 fetchImageUrls 함수의 인자로 전달
  // })
  // .catch(error => {
  //   console.error('Error:', error);
  // });
}

//-------------------
//1. url -> name
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
      console.log("councilLoad universityInfo: ", res);
      Uniname.push(res.university_name);
      universityName.innerHTML = Uniname[0];
    });
}
//2. url -> id
function idLoad() {
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
    .then(res => {
      console.log("idLoad univ_id: ", res);
      current_university_id = res.university_id;
      console.log("current_id: ", current_university_id); //테스트용 로그
    })
    .then(() => {
      return fetch(`${apiUrl}/getCardNewsImageUrl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ university_id: current_university_id })
      });
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("getimage: ", res);
    });
}

const directIdData = async () => {
  console.log('directIdload 실행');
  const url = `${userApiUrl}/university/university-id`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("directIdData: ", data);
}

//3. id -> post_id, img_url


//4. url -> location
//-------------------

window.addEventListener('DOMContentLoaded', function() {
  setSwiper();
  updateDynamicLinks();
  //imagesLoadTest(); //포스트 이미지를 가져오는 함수, 임시라서 나중에 councilLoad랑 합치기
  //councilLoad();
  nameLoad();
  idLoad();
  directIdData();
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
  console.log("다음 버튼");
  slideToNext();
  updateSwiper();
});

// 이전 버튼 클릭시
prevButton.addEventListener('click', function () {
  console.log("이전 버튼");
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
  var url;

  // linkId에 따라 동적 값을 할당하는 로직을 구현합니다.
  if (linkId === "retailer") {
    dynamicValue = "retailer/" + userschool;
    url = baseUrls.partner;
  } else if (linkId === "partner") {
    dynamicValue = "partner/" + userschool;
    url = baseUrls.partner;
  } else if (linkId === "more_news") {
    dynamicValue = "showPostListAll/" + userschool;
    url = baseUrls.post;
  } else if (linkId === "more_retailer") {
    dynamicValue = "retailer/" + userschool;
    url = baseUrls.partner;
  } else if (linkId === "news") {
    dynamicValue = "showPostListAll/" + userschool;
    url = baseUrls.post;
  }

  return `${url}/` + dynamicValue;
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

