import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./components/SocketContext.module";
import App from "./App";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./components/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SocketProvider>
      <App>
        <MainPage />
      </App>
    </SocketProvider>
  </AuthProvider>
);
