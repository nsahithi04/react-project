import { createSlice } from "@reduxjs/toolkit";

const confessionSlice = createSlice({
  name: "confession",
  initialState: {
    title: "",
    description: "",
    receiverPhone: "",
    senderPhone: "",
    titleError: "",
    descriptionError: "",
    receiverPhoneError: "",
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setReceiverPhone: (state, action) => {
      state.receiverPhone = action.payload;
    },
    setSenderPhone: (state, action) => {
      state.senderPhone = action.payload;
    },
    setTitleError: (state, action) => {
      state.titleError = action.payload;
    },
    setDescriptionError: (state, action) => {
      state.descriptionError = action.payload;
    },
    setReceiverPhoneError: (state, action) => {
      state.receiverPhoneError = action.payload;
    },
    resetConfession: (state) => {
      state.title = "";
      state.description = "";
      state.receiverPhone = "";
      state.titleError = "";
      state.descriptionError = "";
      state.receiverPhoneError = "";
    },
  },
});

export const {
  setTitle,
  setDescription,
  setReceiverPhone,
  setSenderPhone,
  setTitleError,
  setDescriptionError,
  setReceiverPhoneError,
  resetConfession,
} = confessionSlice.actions;

export default confessionSlice.reducer;
