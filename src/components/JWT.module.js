import axios from "axios";

// export const A_TOKEN_TIME_OUT = 1800000;

export const handleAccessToken = async () => {
  const uID = localStorage.getItem("u_id");
  const aToken = localStorage.getItem("a_token");
  const rToken = localStorage.getItem("r_token");

  console.log("a_token", aToken);
  console.log("r_token", rToken);
  const refreshTokenHeaders = {
    headers: {
      Authorization: `Bearer ${rToken}`,
    },
  };
  await refreshAccessToken(uID, refreshTokenHeaders, rToken);
};

export const handleRefreshToken = () => {
  setInterval(async () => {
    const uID = localStorage.getItem("u_id");
    const rToken = localStorage.getItem("r_token");

    console.log("r_token", rToken);
    const refreshTokenHeaders = {
      headers: {
        Authorization: `Bearer ${rToken}`,
      },
    };
    await refreshRefreshToken(uID, refreshTokenHeaders, rToken);
  }, 110000);

  // return data;
};

export const handleError = async (error) => {
  const aToken = localStorage.getItem("a_token");
  const rToken = localStorage.getItem("r_token");

  if (error.response.status === 401) {
    const detail = error.response.data.detail;

    if (detail === "Signature verification failed.") {
      console.log("Refresh Token이 인증된 값이 아닙니다.");
      await handleRefreshToken();
    } else if (detail === "Signature has expired.") {
      console.log("Token이 만료되었습니다. 재로그인 해주세요.");
      await handleAccessToken();
    } else if (detail === "Ownership verification failed.") {
      console.log("Refresh Token이 저장한 토큰값과 일치하지 않습니다.");
    } else {
      console.log(error);
    }
  } else if (error.response.status === 403) {
    const detail = error.response.data.detail;
    if (detail === "Signature renewal has denied.") {
      console.log("Token이 아직 만료되지 않았습니다.");
      // token === aToken
      //   ? console.log("Access Token이 아직 만료되지 않았습니다.")
      //   : token === rToken &&
      //     console.log("Refresh Token이 아직 만료되지 않았습니다.");
    } else {
      console.log(error);
    }
  }
};

export const refreshAccessToken = async (u_id, r_token_headers) => {
  try {
    const response = await axios.get(
      `/api/v2/users/issue/access?u_id=${u_id}`,
      r_token_headers
    );
    console.log("access token 재발급 res:", response);

    if (response.status === 200) {
      const newAccessToken = response.data.A_Token;
      localStorage.setItem("a_token", newAccessToken);
    }

    console.log("refreshed access token", localStorage.getItem("a_token"));
  } catch (error) {
    handleError(error);
    // handleError(error, a_token);
  }
};

export const refreshRefreshToken = async (u_id, r_token_headers, r_token) => {
  try {
    const response = await axios.get(
      `/api/v2/users/issue/refresh?u_id=${u_id}`,
      r_token_headers
    );
    console.log("refresh token 재발급 res:", response);
    if (response.status === 200) {
      const newRefreshToken = response.data.R_Token;
      localStorage.setItem("r_token", newRefreshToken);
    }

    console.log("refreshed refresh token", localStorage.getItem("r_token"));
  } catch (error) {
    // handleError(error, r_token);
    handleError(error);
  }
};
