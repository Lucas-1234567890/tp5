// src/context/AppContext.jsx
// Estado global: token JWT, lista de lotes, índice atual e status de rede.
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken]               = useState(() => sessionStorage.getItem("jwt") || null);
  const [leiloes, setLeiloes]           = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOnline, setIsOnline]         = useState(navigator.onLine);

  // Persiste token na sessão
  useEffect(() => {
    if (token) sessionStorage.setItem("jwt", token);
    else sessionStorage.removeItem("jwt");
  }, [token]);

  // Detecta status de rede
  useEffect(() => {
    const up   = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online",  up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online",  up);
      window.removeEventListener("offline", down);
    };
  }, []);

  const logout = () => {
    setToken(null);
    setLeiloes([]);
    setCurrentIndex(0);
  };

  return (
    <AppContext.Provider value={{
      token, setToken, logout,
      leiloes, setLeiloes,
      currentIndex, setCurrentIndex,
      isOnline,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext deve ser usado dentro de AppProvider");
  return ctx;
}