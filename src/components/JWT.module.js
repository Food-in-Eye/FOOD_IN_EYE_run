import axios from "axios";

export const handleJWT = (a_token, r_token) => {
  const reqAToken = {
    headers: {
      Authorization: `Bearer ${a_token}`,
    },
  };

  const reqRToken = {
    headers: {
      Authorization: `Bearer ${r_token}`,
    },
  };

  const resAToken = axios.get("/api/v2/users/test/a_token", reqAToken);
  console.log(resAToken);

  const resRToken = axios.get("/api/v2/users/test/r_token", reqRToken);
  console.log(resRToken);
};
