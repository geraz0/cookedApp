import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create the root for rendering the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component within StrictMode for highlighting potential issues
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional performance logging
// reportWebVitals can log results to the console or an analytics endpoint
// Uncomment the line below if you decide to measure performance
// reportWebVitals(console.log);
reportWebVitals();
