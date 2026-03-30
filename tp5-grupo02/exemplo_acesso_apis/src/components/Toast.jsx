// src/components/Toast.jsx
import { createContext, useContext, useState } from "react";

const ToastContext = createContext();
export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (msg, type = "default") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast show toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}