import { createSlice } from "@reduxjs/toolkit";

export const defaultState = {
  myButtonLabel: "click",
  items: [
    { id: 101, title: "folder 1", type: 1, parent_id: 0 },
    { id: 102, title: "folder 2", type: 1, parent_id: 0 },
    { id: 103, title: "folder 3", type: 1, parent_id: 101 },
    { id: 104, title: "folder 4", type: 1, parent_id: 101 },
    { id: 105, title: "folder 5", type: 1, parent_id: 0 },
    { id: 106, title: "folder 6", type: 1, parent_id: 105 },
    {
      id: 1,
      type: 2,
      parent_id: 101,
      title: "one",
      body: "111 dsqfdsmlk mqkfkdq sfkl qlmskfqm",
    },
    {
      id: 2,
      type: 2,
      parent_id: 101,
      title: "two",
      body: "222 dsqfdsmlk mqkfkdq sfkl 222 qlmskfqm",
    },
    {
      id: 3,
      type: 2,
      parent_id: 103,
      title: "three",
      body: "33 dsqfdsmlk mqkfkdq sfkl 33 qlmskfqm",
    },
    {
      id: 4,
      type: 2,
      parent_id: 103,
      title: "four",
      body: "4222 dsqfdsmlk mqkfkdq sfkl 222 qlmskfqm",
    },
    {
      id: 5,
      type: 2,
      parent_id: 103,
      title: "five",
      body: "5222 dsqfdsmlk mqkfkdq sfkl 222 qlmskfqm",
    },
    {
      id: 6,
      type: 2,
      parent_id: 104,
      title: "six",
      body: "6222 dsqfdsmlk mqkfkdq sfkl 222 qlmskfqm",
    },
    {
      id: 7,
      type: 2,
      parent_id: 104,
      title: "seven",
      body: "7222 dsqfdsmlk mqkfkdq sfkl 222 qlmskfqm",
    },
  ],
  selectedFolderId: null,
  selectedNoteId: null,
  expandedFolderIds: [],
};

const storeSlice = createSlice({
  name: "store",
  initialState: defaultState,
  reducers: {
    select_folder: (state, action) => {
      state.selectedFolderId = action.payload.id;
    },
    select_note: (state, action) => {
      state.selectedNoteId = action.id;
    },
    toggle_folder: (state, action) => {
      var idx = state.expandedFolderIds.indexOf(action.payload.id);
      if (idx < 0) {
        state.expandedFolderIds.push(action.payload.id);
      } else {
        state.expandedFolderIds.splice(idx, 1);
      }
    },
  },
});

export const { select_folder, select_note, toggle_folder } = storeSlice.actions;
export default storeSlice.reducer;
