// src/App.jsx
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Login       from "./components/Login";
import LeilaoList  from "./components/LeilaoList";
import LeilaoDetail from "./components/LeilaoDetail";
import ImovelForm  from "./components/ImovelForm";
import CameraPage  from "./components/CameraPage";
import Navbar      from "./components/Navbar";
import { useToast } from "./components/Toast";

// ── Protected route guard ────────────────────────────
function RequireAuth({ children }) {
  const { token } = useAppContext();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, setToken, leiloes, setLeiloes, currentIndex, setCurrentIndex } = useAppContext();
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
      {/* Public */}
      <Route path="/login" element={
        token ? <Navigate to="/" replace /> : <Login onToken={setToken} />
      } />

      {/* Protected shell */}
      <Route path="/*" element={
        <RequireAuth>
          <div className="app-shell">
            <div className="app-content">
              <Routes>
                <Route path="/" element={
                  <LeilaoList token={token} onSelect={handleSelect} onData={setLeiloes} />
                } />
                <Route path="/detalhe/:idx" element={
                  <LeilaoDetail
                    lote={leiloes[currentIndex]}
                    index={currentIndex}
                    total={leiloes.length}
                    onChangeIndex={(i) => { if (i >= 0 && i < leiloes.length) setCurrentIndex(i); }}
                  />
                } />
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