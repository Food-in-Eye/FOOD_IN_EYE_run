import axios from "axios";

export const handleJWT = async (data) => {
  const refreshTokenHeaders = {
    headers: {
      Authorization: `Bearer ${data.r_token}`,
    },
  };

  await refreshAccessToken(
    data.u_id,
    data.a_create_date,
    refreshTokenHeaders,
    data
  );

  await refreshRefreshToken(
    data.u_id,
    data.r_create_date,
    refreshTokenHeaders,
    data
  );

  return data;
};

export const handleError = (error) => {
  if (error.response.status === 401) {
    const detail = error.response.data.detail;

    if (detail === "Signature verification failed.") {
      console.log("Refresh Token이 인증된 값이 아닙니다.");
    } else if (detail === "Signature has expired.") {
      console.log("Refresh Token이 만료되었습니다. 재로그인 해주세요.");
    } else if (detail === "Ownership verification failed.") {
      console.log("Refresh Token이 저장한 토큰값과 일치하지 않습니다.");
    } else {
      console.log(error);
    }
  } else if (error.response.status === 403) {
    const detail = error.response.data.detail;
    if (detail === "Signature renewal has denied.") {
      console.log("Access Token이 아직 만료되지 않았습니다.");
    } else {
      console.log(error);
    }
  }
};

export const refreshAccessToken = async (
  u_id,
  a_create_date,
  r_token_headers,
  userData
) => {
  try {
    const response = await axios.get(
      `/api/v2/users/issue/access?u_id=${u_id}`,
      r_token_headers
    );
    console.log(response);
    if (response.status === 200) {
      const newAccessToken = response.data.A_Token;
      const create_date = new Date().getTime();

      userData.a_token = newAccessToken;
      userData.a_create_date = create_date;
    }
  } catch (error) {
    handleError(error);
  }
};

export const refreshRefreshToken = async (
  u_id,
  r_create_date,
  r_token_headers,
  userData
) => {
  try {
    const response = await axios.get(
      `/api/v2/users/issue/refresh?u_id=${u_id}`,
      r_token_headers
    );
    console.log(response);
    if (response.status === 200) {
      const newRefreshToken = response.data.R_Token;
      const create_date = new Date().getTime();

      userData.r_token = newRefreshToken;
      userData.r_create_date = create_date;
    }
  } catch (error) {
    handleError(error);
  }
};
