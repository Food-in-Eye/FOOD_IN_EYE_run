import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./components/SocketContext.module";
import App from "./App";
import MainPage from "./pages/MainPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketProvider>
    <App>
      <MainPage />
    </App>
  </SocketProvider>
);
