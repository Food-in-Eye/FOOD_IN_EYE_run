import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./components/SocketContext.module";
import App from "./App";
import MainPage from "./pages/MainPage";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <App>
            <MainPage />
          </App>
        </SocketProvider>
      </PersistGate>
    </Provider>
  </CookiesProvider>
);
