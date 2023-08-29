import { SET_TOKEN, TOKEN_TIME_OUT } from "../store/Auth";
import { handleAccessToken, handleRefreshToken } from "./JWT.module";
import { setRefreshToken } from "../storage/Cookie";

export const refreshAccessToken = (userData) => {
  return async (dispatch) => {
    try {
      // const dispatch = useDispatch();
      const currentTime = new Date().getTime();
      const accessTokenExpireTime = userData.a_create_date + TOKEN_TIME_OUT;

      console.log("accessTokenExpireTime", accessTokenExpireTime);
      if (accessTokenExpireTime <= currentTime) {
        const data = await handleAccessToken(userData);
        console.log("data newAToken", data.a_token);
        dispatch(SET_TOKEN(data.a_token, data.a_create_date));
      }
    } catch (error) {
      console.log("Error Refreshing Access Token:", error);
    }
  };
};

export const refreshRefreshToken = async (userData) => {
  try {
    const data = await handleRefreshToken(userData);
    console.log("data", data);
    console.log("data newRToken", data.r_token);
    setRefreshToken(data.r_token, data.r_create_date);
  } catch (error) {
    console.log("Error Refreshing Refresh Token:", error);
  }
};
