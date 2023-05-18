import React, { createContext, useState } from "react";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketResponse, setSocketResponse] = useState(null);

  return (
    <SocketContext.Provider value={{ socketResponse, setSocketResponse }}>
      {children}
    </SocketContext.Provider>
  );
};
