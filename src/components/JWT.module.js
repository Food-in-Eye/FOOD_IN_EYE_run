import axios from "axios";
import { stopTokenRefresh } from "./TokenRefreshService";

const resetLogin = () => {
  stopTokenRefresh();
  setTimeout(() => {
    localStorage.removeItem("u_id");
    localStorage.removeItem("s_id");
    localStorage.removeItem("a_token");
    localStorage.removeItem("r_token");
    localStorage.removeItem("r_token_create_time");
    localStorage.removeItem("storeNum");

    window.location.href = "/login";
  }, 10000);
};

export const handleAccessToken = async () => {
  const uID = localStorage.getItem("u_id");
  const rToken = localStorage.getItem("r_token");

  const refreshTokenHeaders = {
    headers: {
      Authorization: `Bearer ${rToken}`,
    },
  };
  await refreshAccessToken(uID, refreshTokenHeaders);
};

export const handleRefreshToken = () => {
  const uID = localStorage.getItem("u_id");
  const rToken = localStorage.getItem("r_token");

  const refreshTokenHeaders = {
    headers: {
      Authorization: `Bearer ${rToken}`,
    },
  };
  refreshRefreshToken(uID, refreshTokenHeaders);
};

export const handleError = async (error) => {
  if (error.response.status === 401) {
    console.log(error.response.data.detail);
    resetLogin();
  } else if (error.response.status === 403) {
    console.log(error.response.data.detail);
  } else if (error.response.status === 422) {
    console.log(error.response.data.detail);
    if (error.response.data.detail === "R_Token mismatch.") {
      resetLogin();
    }
  } else {
    console.log(error);
  }
};

export const refreshAccessToken = async (u_id, r_token_headers) => {
  try {
    const response = await axios.get(
      `/api/v2/users/issue/access?u_id=${u_id}`,
      r_token_headers
    );

    if (response.status === 200) {
      const newAccessToken = response.data.A_Token;
      localStorage.setItem("a_token", newAccessToken);
    }
  } catch (error) {
    handleError(error);
  }
};

const refreshRefreshToken = async (u_id, r_token_headers) => {
  try {
    const response = await axios.get(
      `/api/v2/users/issue/refresh?u_id=${u_id}`,
      r_token_headers
    );
    if (response.status === 200) {
      const newRefreshToken = response.data.R_Token;
      const newRefreshTokenCreationTime = new Date(
        response.headers.date
      ).getTime();
      localStorage.setItem("r_token", newRefreshToken);
      localStorage.setItem("r_token_create_time", newRefreshTokenCreationTime);
    }
  } catch (error) {
    handleError(error);
  }
};
