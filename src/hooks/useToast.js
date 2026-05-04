import React, { useState, useEffect, createContext, useContext } from "react";
import { X, AlertCircle, Check, Info } from "lucide-react";

// Toast Types
const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

// Toast Component
const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getStyles = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          bg: "bg-green-500",
          icon: <Check className="w-5 h-5" />,
          border: "border-green-600",
        };
      case TOAST_TYPES.ERROR:
        return {
          bg: "bg-red-500",
          icon: <AlertCircle className="w-5 h-5" />,
          border: "border-red-600",
        };
      case TOAST_TYPES.WARNING:
        return {
          bg: "bg-yellow-500",
          icon: <AlertCircle className="w-5 h-5" />,
          border: "border-yellow-600",
        };
      default:
        return {
          bg: "bg-blue-500",
          icon: <Info className="w-5 h-5" />,
          border: "border-blue-600",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in-right mb-2 min-w-[300px] max-w-md`}
      role="alert"
    >
      {styles.icon}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="hover:opacity-75 transition-opacity"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Toast Context
const ToastContext = createContext(null);

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = TOAST_TYPES.INFO) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (message) => addToast(message, TOAST_TYPES.SUCCESS),
    error: (message) => addToast(message, TOAST_TYPES.ERROR),
    info: (message) => addToast(message, TOAST_TYPES.INFO),
    warning: (message) => addToast(message, TOAST_TYPES.WARNING),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};