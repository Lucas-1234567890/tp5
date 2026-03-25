// src/App.jsx — projeto WEB (Vite + React)
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import LeilaoList from "./components/LeilaoList";
import LeilaoDetail from "./components/LeilaoDetail";
import ImovelForm from "./components/ImovelForm";
import Navbar from "./components/Navbar";
import { useToast } from "./components/Toast";

export default function App() {
  const { token, setToken, leiloes, setLeiloes, currentIndex, setCurrentIndex } =
    useAppContext();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSelect = (i) => {
    setCurrentIndex(i);
    navigate(`/detalhe/${i}`);
  };

  const handleSaveImovel = (imovel) => {
    console.log("Veículo salvo", imovel);
    toast.show("Veículo salvo com sucesso");
    navigate("/");
  };

  if (!token) return <Login onToken={setToken} />;

  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <LeilaoList
                token={token}
                onSelect={handleSelect}
                onData={setLeiloes}
              />
            }
          />
          <Route
            path="/detalhe/:idx"
            element={
              <LeilaoDetail
                lote={leiloes[currentIndex]}
                index={currentIndex}
                total={leiloes.length}
                onChangeIndex={(i) => {
                  if (i >= 0 && i < leiloes.length) setCurrentIndex(i);
                }}
              />
            }
          />
          <Route
            path="/novo"
            element={<ImovelForm onSave={handleSaveImovel} />}
          />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}