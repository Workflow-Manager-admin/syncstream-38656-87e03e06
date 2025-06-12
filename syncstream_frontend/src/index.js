import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
/*
 * If any usage of PUBLIC_URL is needed in the code, use process.env.PUBLIC_URL in JS,
 * and use %PUBLIC_URL% in public/index.html or static HTML files with Create React App.
 * This file itself contains no direct PUBLIC_URL usage.
 */
