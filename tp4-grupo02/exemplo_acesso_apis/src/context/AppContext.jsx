// src/context/AppContext.jsx
// Centraliza o estado global da aplicação e expõe via Context.
// Páginas consomem via useAppContext() — sem prop drilling.
import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken] = useState(null);       // JWT obtido no login
  const [leiloes, setLeiloes] = useState([]);      // lista de lotes carregados
  const [currentIndex, setCurrentIndex] = useState(0); // lote selecionado

  return (
    <AppContext.Provider
      value={{ token, setToken, leiloes, setLeiloes, currentIndex, setCurrentIndex }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext deve ser usado dentro de AppProvider");
  return ctx;
}