import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    uid: "",
    name: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.name = action.payload.name;
    },
    logoutUser: (state) => {
      state.email = "";
      state.uid = "";
      state.name = "";
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
