import React from "react";
import ReactDOM from "react-dom/client";
import RootFolderList from "./components/root-folder-list.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducer.jsx";
import NoteList from "./components/note-list.jsx";

export const store = configureStore({
  reducer: {
    items: Reducer,
  },
});

const App = () => {
  return (
    <div>
      <RootFolderList />
      <NoteList />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
