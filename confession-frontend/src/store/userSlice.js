import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    phone: "",
    nameError: "",
    phoneError: "",
    otp: "",
    otpError: "",
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setNameError: (state, action) => {
      state.nameError = action.payload;
    },
    setPhoneError: (state, action) => {
      state.phoneError = action.payload;
    },
    setOtpError: (state, action) => {
      state.otpError = action.payload;
    },
    logoutUser: (state) => {
      state.name = "";
      state.phone = "";
      state.otp = "";
      state.nameError = "";
      state.phoneError = "";
      state.otpError = "";
    },
  },
});

export const {
  setName,
  setPhone,
  setOtp,
  setNameError,
  setPhoneError,
  setOtpError,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
