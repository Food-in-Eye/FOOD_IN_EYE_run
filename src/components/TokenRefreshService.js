import { handleRefreshToken } from "./JWT.module";

let isRunning = false;
let refreshTokenInterval;

export const startTokenRefresh = () => {
  if (isRunning) return;

  console.log("token service 시작");
  isRunning = true;

  const rTokenCreateTime = localStorage.getItem("r_token_create_time");
  const currentTime = new Date().getTime();

  // refresh token이 만료될 때까지 남은 시간 계산
  const timeUntilExpiration = 110000 - (currentTime - rTokenCreateTime);

  // 만료 시간 이전에 재발급 요청을 하도록 설정
  if (timeUntilExpiration > 0) {
    console.log("currentTime", currentTime);
    console.log("rTokenCreateTime", rTokenCreateTime);
    console.log("timeUntilExpiration", timeUntilExpiration);
    refreshTokenInterval = setInterval(() => {
      console.log("token service: refresh 재발급");
      handleRefreshToken();
    }, timeUntilExpiration);
  } else {
    console.log("refresh token이 이미 만료되었습니다.");
  }
};

export const stopTokenRefresh = () => {
  // TokenRefreshService 중지
  isRunning = false;
  console.log("token service 중지");
  clearInterval(refreshTokenInterval);
};
