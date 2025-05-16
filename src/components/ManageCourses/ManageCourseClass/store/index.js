import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PageNumber: 1,
  RowsOfPage: 10,
  Query: "",
  FilteredData: [],
  Data: [],
};

const classRomeListReduce = createSlice({
  name: "classRomeListReduce",
  initialState,
  reducers: {
    handleData: (state, action) => {
      state.Data = action.payload;
      state.FilteredData = action.payload;
    },
    handlePageNumber: (state, action) => {
      state.PageNumber = action.payload;
    },
    handleRowsOfPage: (state, action) => {
      state.RowsOfPage = action.payload;
    },
    handleQuery: (state, action) => {
      state.Query = action.payload;
      if (!action.payload.trim()) {
        state.FilteredData = state.Data; 
      } else {
        state.FilteredData = state.Data.filter(
          (item) =>
            item.classRoomName &&
            item.classRoomName.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
  },
});

export const { handleData, handlePageNumber, handleQuery, handleRowsOfPage } =
  classRomeListReduce.actions;
export default classRomeListReduce.reducer;