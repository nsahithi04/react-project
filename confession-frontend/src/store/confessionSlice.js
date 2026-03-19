import { createSlice } from "@reduxjs/toolkit";

const confessionSlice = createSlice({
  name: "confession",
  initialState: {
    title: "",
    description: "",
    receiverEmail: "",
    titleError: "",
    descriptionError: "",
    receiverEmailError: "",
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setReceiverEmail: (state, action) => {
      state.receiverEmail = action.payload;
    },
    setTitleError: (state, action) => {
      state.titleError = action.payload;
    },
    setDescriptionError: (state, action) => {
      state.descriptionError = action.payload;
    },
    setReceiverEmailError: (state, action) => {
      state.receiverEmailError = action.payload;
    },
    resetConfession: (state) => {
      state.title = "";
      state.description = "";
      state.receiverEmail = "";
      state.titleError = "";
      state.descriptionError = "";
      state.receiverEmailError = "";
    },
  },
});

export const {
  setTitle,
  setDescription,
  setReceiverEmail,
  setTitleError,
  setDescriptionError,
  setReceiverEmailError,
  resetConfession,
} = confessionSlice.actions;

export default confessionSlice.reducer;
