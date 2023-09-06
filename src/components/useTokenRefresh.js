import { useEffect } from "react";
import { startTokenRefresh, stopTokenRefresh } from "./TokenRefreshService";

function useTokenRefresh() {
  useEffect(() => {
    console.log("startTokenRefresh 실행");
    startTokenRefresh();
    return () => {
      stopTokenRefresh();
    };
  }, []);
}

export default useTokenRefresh;
