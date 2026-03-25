import { createContext, useContext, useState } from "react";

const ToastContext = createContext();
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const show = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={"toast" + (visible ? " show" : "")}>{message}</div>
    </ToastContext.Provider>
  );
}
