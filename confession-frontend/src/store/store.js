import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import userReducer from "./userSlice";
import confessionReducer from "./confessionSlice";

const userPersistConfig = {
  key: "user",
  storage,
  blacklist: ["nameError", "phoneError", "otpError", "otp"],
};

const confessionPersistConfig = {
  key: "confession",
  storage: storageSession,
  blacklist: ["titleError", "descriptionError", "receiverPhoneError"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  confession: persistReducer(confessionPersistConfig, confessionReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
