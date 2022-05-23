// const redirect_uri = "http://localhost:3000/api/user/kakao/callback";
const redirect_uri = "http://localhost:3000//api/user/kakao/callback";
// 배포한 주소로

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`;
