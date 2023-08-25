import { Cookies } from "react-cookie";
import { TOKEN_TIME_OUT } from "../store/Auth";

const cookies = new Cookies();

export const setRefreshToken = (refreshToken, create_date) => {
  //   const createTime = create_date;
  //   console.log("createTime", createTime);
  //   const today = new Date();
  const expireDate = create_date + TOKEN_TIME_OUT;

  return cookies.set("r_token", refreshToken, {
    sameSite: "strict",
    path: "/",
    expires: new Date(expireDate),
  });
};

export const getCookieToken = () => {
  return cookies.get("refresh_token");
};

export const removeCookieToken = () => {
  return cookies.remove("refresh_token", { sameSite: "strict", path: "/" });
};
