// src/context/AppContext.jsx
// Estado global: token JWT, lista de lotes, índice atual, status de rede e fotos por lote.
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken]               = useState(() => sessionStorage.getItem("jwt") || null);
  const [leiloes, setLeiloes]           = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOnline, setIsOnline]         = useState(navigator.onLine);

  // Mapa de fotos: { [loteId]: [{ id, url, timestamp }] }
  const [lotePhotos, setLotePhotos]     = useState({});

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
    // Mantém as fotos mesmo após logout (opcional: limpar também)
  };

  /** Adiciona uma foto a um lote específico */
  const addPhotoToLote = (loteId, photoUrl) => {
    setLotePhotos(prev => ({
      ...prev,
      [loteId]: [
        ...(prev[loteId] || []),
        { id: Date.now(), url: photoUrl, timestamp: new Date().toISOString() },
      ],
    }));
  };

  /** Remove uma foto de um lote específico */
  const removePhotoFromLote = (loteId, photoId) => {
    setLotePhotos(prev => ({
      ...prev,
      [loteId]: (prev[loteId] || []).filter(p => p.id !== photoId),
    }));
  };

  /** Retorna fotos de um lote */
  const getPhotosForLote = (loteId) => lotePhotos[loteId] || [];

  return (
    <AppContext.Provider value={{
      token, setToken, logout,
      leiloes, setLeiloes,
      currentIndex, setCurrentIndex,
      isOnline,
      lotePhotos,
      addPhotoToLote,
      removePhotoFromLote,
      getPhotosForLote,
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