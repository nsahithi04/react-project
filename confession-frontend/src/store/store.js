import { configureStore } from "@reduxjs/toolkit";
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
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import confessionReducer from "./confessionSlice";

const persistConfig = {
  key: "root",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
  blacklist: ["nameError", "phoneError", "otpError"],
};

const confessionPersistConfig = {
  key: "confession",
  storage,
  blacklist: ["titleError", "descriptionError", "receiverPhoneError"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  confession: persistReducer(confessionPersistConfig, confessionReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
