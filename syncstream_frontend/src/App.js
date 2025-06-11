import React from "react";
import "./App.css";
import SyncStreamMainContainer from "./SyncStreamMainContainer";

// PUBLIC_INTERFACE
/** Main app wrapper to mount SyncStreamMainContainer */
function App() {
  return (
    <div className="app">
      <SyncStreamMainContainer />
    </div>
  );
}

export default App;