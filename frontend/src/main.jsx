//frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles

import App from './App.jsx';
import './index.css'; // Your Tailwind and global CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter must wrap the App since App.jsx only contains Routes */}
    <BrowserRouter>
      <App />
      
      {/* Global Toast Notifications Config */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light" // Matches your soft, light template vibe
      />
    </BrowserRouter>
  </React.StrictMode>,
);