import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./hooks/useToast";
// import { ToastProvider } from "./hooks/useToast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/Context";
// import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/client">
     <ToastProvider>
    <AuthProvider>
    
      <App />
    
    </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);