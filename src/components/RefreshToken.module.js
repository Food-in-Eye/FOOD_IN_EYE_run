import { SET_TOKEN, TOKEN_TIME_OUT } from "../store/Auth";
import { handleAccessToken, handleRefreshToken } from "./JWT.module";
import { useDispatch } from "react-redux";
import { setRefreshToken } from "../storage/Cookie";
import { useEffect } from "react";

function RefreshToken({ userData }) {
  const dispatch = useDispatch();

  useEffect(() => {
    /** 10초마다 refreshToken 재발급 + accessToken 만료 시 재발급 함수 호출 */
    const startTokenRefresh = async () => {
      try {
        setInterval(async () => {
          const currentTime = new Date().getTime();
          const accessTokenExpireTime = userData.a_create_date + TOKEN_TIME_OUT;

          console.log("accessTokenExpireTime", accessTokenExpireTime);
          if (accessTokenExpireTime <= currentTime) {
            const data = await handleAccessToken(userData);
            console.log("data newAToken", data.a_token);
            dispatch(SET_TOKEN(data.a_token, data.a_create_date));
          }
          const data = await handleRefreshToken(userData);
          console.log("data", data);
          console.log("data newRToken", data.r_token);
          setRefreshToken(data.r_token, data.r_create_date);
          // dispatch(SET_TOKEN(data.a_token, data.a_create_date));
        }, 10000);
      } catch (error) {
        console.log("Error Refreshing Tokens:", error);
      }
    };

    startTokenRefresh();
  }, [dispatch, userData]);

  return null;
}

export default RefreshToken;
