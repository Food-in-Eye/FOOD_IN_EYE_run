import { configureStore } from "@reduxjs/toolkit";
import { authToken } from "./Auth";

// import combineReducers from "redux";
// import storageSession from "redux-persist/lib/storage/session";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

// const reducers = combineReducers({
//   token: tokenSlice.reducer,
// });

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["authToken"],
};

const persistedReducer = persistReducer(persistConfig, authToken);

const store = configureStore({
  reducer: {
    authToken: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;
