import React from 'react';
import './App.css';
import SyncStreamMain from './SyncStreamMain';

// PUBLIC_INTERFACE
/**
 * Main application wrapper.
 * Renders the SyncStream Main Container.
 */
function App() {
  return (
    <div className="app">
      <SyncStreamMain />
    </div>
  );
}

export default App;