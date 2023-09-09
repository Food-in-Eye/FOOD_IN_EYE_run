import { useEffect } from "react";
import { startTokenRefresh, stopTokenRefresh } from "./TokenRefreshService";

function useTokenRefresh() {
  useEffect(() => {
    startTokenRefresh();
    return () => {
      stopTokenRefresh();
    };
  }, []);
}

export default useTokenRefresh;
