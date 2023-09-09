import { handleRefreshToken } from "./JWT.module";

let isRunning = false;
let refreshTokenInterval;

export const startTokenRefresh = () => {
  if (isRunning) return;

  isRunning = true;
  const rTokenCreateTime = localStorage.getItem("r_token_create_time");
  const currentTime = new Date().getTime();

  const timeUntilExpiration = 7200000 - (currentTime - rTokenCreateTime);

  if (timeUntilExpiration > 0) {
    refreshTokenInterval = setInterval(() => {
      handleRefreshToken();
    }, timeUntilExpiration);
  } else {
    console.log("refresh token이 이미 만료되었습니다.");
  }
};

export const stopTokenRefresh = () => {
  isRunning = false;
  clearInterval(refreshTokenInterval);
};
