import { handleAccessToken, handleRefreshToken } from "./JWT.module";

export const startRTokenRefresh = () => {
  setInterval(async () => {
    console.log("refresh 토큰 갱신 시도 중..");

    const rToken = localStorage.getItem("r_token");
    console.log("data beforeRToken", rToken);

    try {
      //   const data = await handleAccessToken();
      //   console.log("data newAToken", data.a_token);
      //   localStorage.setItem("a_token", data.a_token);

      await handleRefreshToken();

      console.log("data newRToken", rToken);
      //   localStorage.setItem("r_token", data.r_token);
    } catch (error) {
      console.log("Error Refreshing Tokens:", error);
    }
  }, 10000);
};

export const startATokenRefresh = async () => {
  console.log("access 토큰 갱신 시도 중..");

  const aToken = localStorage.getItem("a_token");
  console.log("data newAToken", aToken);

  try {
    await handleAccessToken();
    console.log("data newAToken", aToken);
    //   localStorage.setItem("a_token", data.a_token);
  } catch (error) {
    console.log("Error Refreshing Access Tokens:", error);
  }
};
