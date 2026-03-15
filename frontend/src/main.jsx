// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import './index.css';
import { AuthProvider } from "./context/AuthContext"; // Import your new Context

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap App with AuthProvider so the "Auth Brain" starts working */}
      <AuthProvider>
        <App />
      </AuthProvider>
      
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
        theme="light" 
      />
    </BrowserRouter>
  </React.StrictMode>,
);