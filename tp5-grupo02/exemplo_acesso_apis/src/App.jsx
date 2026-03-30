// src/App.jsx
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Login        from "./components/Login";
import LeilaoList   from "./components/LeilaoList";
import LeilaoDetail from "./components/LeilaoDetail";
import ImovelForm   from "./components/ImovelForm";
import CameraPage   from "./components/CameraPage";
import Navbar       from "./components/Navbar";
import { useToast } from "./components/Toast";
// ⚠️ Remover import e rota /api-debug antes da entrega final
import ApiDebug from "./components/__tests__/ApiDebug";

function RequireAuth({ children }) {
  const { token } = useAppContext();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, setToken, setLeiloes, setCurrentIndex } = useAppContext();
  const toast    = useToast();
  const navigate = useNavigate();

  const handleSelect = (i) => {
    setCurrentIndex(i);
    navigate(`/detalhe/${i}`);
  };

  const handleSaveImovel = (imovel) => {
    console.log("Veículo salvo:", imovel);
    toast.show("Veículo salvo com sucesso 🚗", "success");
    navigate("/");
  };

  return (
    <Routes>
      {/* Debug — remover antes da entrega */}
      <Route path="/api-debug" element={<ApiDebug />} />

      <Route path="/login" element={
        token ? <Navigate to="/" replace /> : <Login onToken={setToken} />
      } />

      <Route path="/*" element={
        <RequireAuth>
          <div className="app-shell">
            <div className="app-content">
              <Routes>
                <Route path="/" element={
                  <LeilaoList token={token} onSelect={handleSelect} onData={setLeiloes} />
                } />
                {/* LeilaoDetail agora lê tudo do contexto — sem props */}
                <Route path="/detalhe/:idx" element={<LeilaoDetail />} />
                <Route path="/novo"   element={<ImovelForm onSave={handleSaveImovel} />} />
                <Route path="/camera" element={<CameraPage />} />
                
                <Route path="*"       element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Navbar />
          </div>
        </RequireAuth>
      } />
    </Routes>
  );
}